"use strict";

function TapTargetGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

TapTargetGame.prototype = Object.create(Game.prototype);
TapTargetGame.prototype.constructor = TapTargetGame;

(function initialization_TapTargetGame() {
    var _levelDifficulty = [
        { sprites: 6, coverage: 0.3 },
        { sprites: 10, coverage: 0.45 },
        { sprites: 13, coverage: 0.55 },
        { sprites: 17, coverage: 0.6 },
        { sprites: 20, coverage: 0.7 },
        { sprites: 24, coverage: 0.8 }
    ];
    var _maxLevels = _levelDifficulty.length;

    function _createNewSprite(game) {
        var coverageX = GlobalRuleSet.GameWidth * game.levelDescriptor.coverage / 2;
        var coverageY = GlobalRuleSet.GameHeight * game.levelDescriptor.coverage / 2;

        var x = GlobalRuleSet.GameCenterX + Math.randomIntInRange(-coverageX, coverageX);
        var y = GlobalRuleSet.GameCenterY + Math.randomIntInRange(-coverageY, coverageY);

        game.targetSprite = new ClickSequenceSprite(game.spritesLeft, x, y);
        game.rootSprite.addChild(game.targetSprite);
    }

    var _clickHandler = function click(evt) {
        if (this.targetSprite) {
            var rootSprite = this.rootSprite;
            var targetSprite = this.targetSprite;

            if (Math.distance2d(targetSprite.x, targetSprite.y, evt.offsetX, evt.offsetY) <= targetSprite.radius) {
                this.score += 500 * this.level;

                SoundManager.play("pop");
                this.rootSprite.removeChild(this.targetSprite);
                this.targetSprite = null;
                this.spritesLeft--;

                if (this.spritesLeft > 0) {
                    _createNewSprite(this);
                }
                else {
                    this.earlyWin = true;
                }
            }
        }
    }

    Object.defineProperties(TapTargetGame.prototype, {
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
                this.levelDescriptor = _levelDifficulty[normalizedLevelDifficulty];
                this.spritesLeft = this.levelDescriptor.sprites;

                // Build the first sprite, but we'll wait on the other sprites until this one is clicked.
                _createNewSprite(this);
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
                if (!this.targetSprite) {
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