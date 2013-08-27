"use strict";

function DrawSomethingGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

DrawSomethingGame.prototype = Object.create(Game.prototype);
DrawSomethingGame.prototype.constructor = DrawSomethingGame;

(function initialization_DrawSomethingGame() {
    var _colors = [ "black", "red", "blue", "green", "pink", "purple" ];

    var _listening = false;
    function _downHandler(evt) {
        _listening = false;

        var hitSprite = this.rootSprite.hitTestSquare(evt.offsetX, evt.offsetY, 20);
        if (hitSprite && hitSprite instanceof FillSprite) {
            this.color = hitSprite.fill;
        }
        else {
            _listening = true;
            var pathSprite = new PathSprite(0, 0, this.color);
            pathSprite.addPoint({ x: evt.offsetX, y: evt.offsetY });
            this.paths.push(pathSprite);
            this.rootSprite.addChild(pathSprite);
        }
    }
    function _upHandler(evt) {
        _moveHandler.call(this, evt);
        _listening = false;
    }
    function _moveHandler(evt) {
        if (_listening) {
            var currentPath = this.paths[this.paths.length - 1];
            currentPath.addPoint({ x: evt.offsetX, y: evt.offsetY });
            this.score += this.level * currentPath.points.length;
        }
    }

    Object.defineProperties(DrawSomethingGame.prototype, {
        update: {
            value: function update() {
                // Animation update loop, this is the only callback per frame the game will get so it needs to set up the visual tree
                // now so that when the rendering occurs everything is reflected already.
            }
        },

        init: {
            value: function init(gameDescriptor) {
                Game.prototype.init.call(this, gameDescriptor);

                // This is called once at the beginning when we initialize all of the games currently. May get called more if we introduce
                // a reset functionality to play more than once.
                this.boundDown = _downHandler.bind(this);
                this.boundMove = _moveHandler.bind(this);
                this.boundUp = _upHandler.bind(this);

                for (var i = 0; i < _colors.length; i++) {
                    this.rootSprite.addChild(new FillSprite(GlobalRuleSet.GameMinX + 20, GlobalRuleSet.GameMinY + 20 + i * 40, 30, 30, _colors[i]));
                }
            }
        },

        activate: {
            value: function activate(activationContext) {
                Game.prototype.activate.call(this, activationContext);

                this.paths = [];
            }
        },
        inputActivate: {
            value: function inputActivate(activationContext) {
                Game.prototype.inputActivate.call(this, activationContext);

                activationContext.renderTargetElement.addEventListener("mousedown", this.boundDown);
                activationContext.renderTargetElement.addEventListener("mousemove", this.boundMove);
                activationContext.renderTargetElement.addEventListener("mouseup", this.boundUp);

                this.color = "black";
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                Game.prototype.deactivate.call(this, activationContext);

                activationContext.renderTargetElement.removeEventListener("mousedown", this.boundDown);
                activationContext.renderTargetElement.removeEventListener("mousemove", this.boundMove);
                activationContext.renderTargetElement.removeEventListener("mouseup", this.boundUp);

                this.rootSprite.removeAllChildren();
                return true;
            }
        },

        getLeaderboardScore: {
            value: function getLeaderboardScore() {
            }
        }
    });
})();