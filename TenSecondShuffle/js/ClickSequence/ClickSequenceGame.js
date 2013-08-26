"use strict";


function ClickSequenceGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

ClickSequenceGame.prototype = Object.create(Game.prototype);
ClickSequenceGame.prototype.constructor = ClickSequenceGame;

(function initialization_ClickSequenceGame() {
    var _levelDifficulty = [
        { sprites: 5, coverage: 0.3 },
        { sprites: 8, coverage: 0.45 },
        { sprites: 11, coverage: 0.55 },
        { sprites: 14, coverage: 0.6 },
        { sprites: 17, coverage: 0.7 },
        { sprites: 20, coverage: 0.8 }
    ];
    var _maxLevels = _levelDifficulty.length;
    var _clickHandler = function click(evt) {
        var fSuccessHit = false;

        var rootSprite = this.rootSprite;
        var childCount = rootSprite.children.length;
        if (childCount > 0) {
            var childSprite = rootSprite.children[childCount - 1];
            var xDist = evt.offsetX - childSprite.x;
            var yDist = evt.offsetY - childSprite.y;
            var dist = Math.sqrt(xDist * xDist + yDist * yDist);

            if (dist < childSprite.radius) {
                this.score += this.level * 500;
                fSuccessHit = true;
                SoundManager.play("pop");
                rootSprite.removeChild(childSprite);

                if (this.rootSprite.children.length === 0) {
                    this.earlyWin = true;
                }
            }
        }

        if (!fSuccessHit) {
            SoundManager.play("burmp");
        }
    }

    Object.defineProperties(ClickSequenceGame.prototype, {
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

                // Build them in reverse order so they draw properly with lower numbers on top and simplified hit testing.
                var coverageX = GlobalRuleSet.GameWidth * this.levelDescriptor.coverage / 2;
                var coverageY = GlobalRuleSet.GameHeight * this.levelDescriptor.coverage / 2;

                for (var i = this.levelDescriptor.sprites; i > 0; i--) {
                    var x = GlobalRuleSet.GameCenterX + Math.randomIntInRange(-coverageX, coverageX);
                    var y = GlobalRuleSet.GameCenterY + Math.randomIntInRange(-coverageY, coverageY);

                    var sprite = new ClickSequenceSprite(i, x, y);
                    this.rootSprite.addChild(sprite);
                }
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