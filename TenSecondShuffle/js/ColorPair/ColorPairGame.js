"use strict";

function ColorPairGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

ColorPairGame.prototype = Object.create(Game.prototype);
ColorPairGame.prototype.constructor = ColorPairGame;

(function initialization_ColorPairGame() {
    var _levelDifficulty = [
        { colors: 2, pairs: 4 },
        { colors: 3, pairs: 5 },
        { colors: 3, pairs: 6 },
        { colors: 4, pairs: 5 },
        { colors: 5, pairs: 8 },
        { colors: 5, pairs: 10 },
    ];
    var _colors = [ "red", "blue", "green", "yellow", "purple" ];
    var _maxLevels = _levelDifficulty.length;
    
    function _createColorSquare(gridSquares, currentColor) {
        var entry = Math.floor(Math.random() * gridSquares.length);
        var gridSquare = gridSquares.splice(entry, 1)[0];
        var gridX = gridSquare % 6;
        var gridY = Math.floor(gridSquare / 6);

        return new ColorPairSprite(GlobalRuleSet.GameCenterX - 250 + gridX * 100, GlobalRuleSet.GameCenterY - 250 + gridY * 100, _colors[currentColor]);
    }
    function _clickHandler(evt) {
        var fSuccessfulHit = true;
        var hitSprite = this.rootSprite.hitTestSquare(evt.offsetX, evt.offsetY, 32);
        if (hitSprite) {
            if (this.previousSprite && this.previousSprite !== hitSprite) {
                if (hitSprite.color === this.previousSprite.color) {
                    this.score += 500 * this.level;

                    SoundManager.play("pop");

                    this.rootSprite.removeChild(hitSprite);
                    this.rootSprite.removeChild(this.previousSprite);
                    hitSprite = null;

                    if (this.rootSprite.children.length === 0) {
                        this.earlyWin = true;
                    }
                }
                else {
                    fSuccessfulHit = false;
                }
            }
        }
        if (!fSuccessfulHit) {
            SoundManager.play("burmp");
        }
        this.previousSprite = hitSprite;
    }

    Object.defineProperties(ColorPairGame.prototype, {
        showWinOverlay: {
            value: true
        },

        update: {
            value: function update() {
            }
        },
        init: {
            value: function init(gameDescriptor) {
                Game.prototype.init.call(this, gameDescriptor);

                this.level = 0;
                this.boundClick = _clickHandler.bind(this);
            }
        },

        activate: {
            value: function activate(activationContext) {
                Game.prototype.activate.call(this, activationContext);

                this.level++;
                var normalizedLevelDifficulty = Math.min(this.level - 1, _maxLevels - 1);
                var levelDescriptor = _levelDifficulty[normalizedLevelDifficulty];

                var gridSquares = [];
                for (var i = 0; i < 36; i++) {
                    gridSquares[i] = i;
                }

                var pairCount = levelDescriptor.pairs;
                var currentColor = 0;
                for (var i = 0; i < pairCount; i++) {
                    this.rootSprite.addChild(_createColorSquare(gridSquares, currentColor));
                    this.rootSprite.addChild(_createColorSquare(gridSquares, currentColor));

                    currentColor = (currentColor + 1) % levelDescriptor.colors;
                }
            }
        },
        inputActivate: {
            value: function inputActivate(activationContext) {
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

                this.previousSprite = null;
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