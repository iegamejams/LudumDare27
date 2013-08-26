"use strict";

function MemoryGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

MemoryGame.prototype = Object.create(Game.prototype);
MemoryGame.prototype.constructor = MemoryGame;

(function initialization_MemoryGame() {

    var _clickHandler = function click(evt) {
        var game = this;
        var rootSprite = this.rootSprite;

        var hitSprite = rootSprite.hitTestSquare(evt.offsetX, evt.offsetY, 32);
        if (hitSprite) {
            if (this.previousSprite && this.previousSprite !== hitSprite) {
                if (this.previousSprite.image === hitSprite.image) {
                    this.rootSprite.removeChild(this.previousSprite);
                    this.rootSprite.removeChild(hitSprite);
                    hitSprite = null;
                }
            }
            this.previousSprite = hitSprite;
        }
    }

    Object.defineProperties(MemoryGame.prototype, {
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
                this.level = 0;
                this.boundClick = _clickHandler.bind(this);
            }
        },

        activate: {
            value: function activate(activationContext) {
                Game.prototype.activate.call(this, activationContext);

                this.level++;
            }
        },
        inputActivate: {
            value: function inputActivate(activationContext) {
                Game.prototype.inputActivate.call(this, activationContext);

                activationContext.renderTargetElement.addEventListener("click", this.boundClick);
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                Game.prototype.deactivate.call(this, activationContext);

                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);

                // Determine if the player won or lost
                var canContinue = false;
                if (this.rootSprite.children.length === 0) {
                    canContinue = true;
                }

                this.rootSprite.removeAllChildren();
                return canContinue;
            }
        },

        getLeaderboardScore: {
            value: function getLeaderboardScore() {
            }
        }
    });
})();