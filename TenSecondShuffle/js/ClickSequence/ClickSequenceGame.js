"use strict";


function ClickSequenceGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

ClickSequenceGame.prototype = Object.create(Game.prototype);
ClickSequenceGame.prototype.constructor = ClickSequenceGame;

(function initialization_ClickSequenceGame() {
    var _levelDifficulty = [
        5, 9, 13, 17, 20, 25
    ];
    var _maxLevels = _levelDifficulty.length;
    var _clickHandler = function click(evt) {
        var rootSprite = this.rootSprite;
        var childCount = rootSprite.children.length;
        if (childCount > 0) {
            var childSprite = rootSprite.children[childCount - 1];
            var xDist = evt.offsetX - childSprite.x;
            var yDist = evt.offsetY - childSprite.y;
            var dist = Math.sqrt(xDist * xDist + yDist * yDist);

            if (dist < childSprite.radius) {
                rootSprite.removeChild(childSprite);
            }
        }
    }

    Object.defineProperties(ClickSequenceGame.prototype, {
        update: {
            value: function update() {
            }
        },

        init: {
            value: function init() {
                this.level = 0;
                this.boundClick = _clickHandler.bind(this);
            }
        },

        activate: {
            value: function activate(activationContext) {
                this.level++;
                var normalizedLevelDifficulty = Math.min(this.level - 1, _maxLevels - 1);
                var spriteCount = _levelDifficulty[normalizedLevelDifficulty];

                // Build them in reverse order so they draw properly with lower numbers on top and simplified hit testing.
                for (var i = spriteCount; i > 0; i--) {
                    var x = Math.random() * GlobalRuleSet.GameWidth + GlobalRuleSet.GameMinX;
                    var y = Math.random() * GlobalRuleSet.GameHeight + GlobalRuleSet.GameMinY;

                    var sprite = new ClickSequenceSprite(i, x, y);
                    this.rootSprite.addChild(sprite);
                }

                activationContext.renderTargetElement.addEventListener("click", this.boundClick);
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
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