"use strict";

function PotteryBarn(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

PotteryBarn.prototype = Object.create(Game.prototype);
PotteryBarn.prototype.constructor = PotteryBarn;

(function initialization_PotteryBarn() {
    var _pumpArea = 400;
    var _levelDifficulty = [
        { radius: 30, pop: 40, airLoss: _pumpArea / 48 },
        { radius: 35, pop: 42, airLoss: _pumpArea / 45 },
        { radius: 40, pop: 46, airLoss: _pumpArea / 42 },
        { radius: 50, pop: 55, airLoss: _pumpArea / 39 },
        { radius: 60, pop: 64, airLoss: _pumpArea / 36 },
        { radius: 75, pop: 78, airLoss: _pumpArea / 30 },
    ];
    var _maxLevels = _levelDifficulty.length;
    var _clickHandler = function click(evt) {

        if(isInView(evt.offsetX, evt.offsetY) )
            this.rootSprite.claySprite.updateTouch(evt.offsetX, evt.offsetY);
    }

    Object.defineProperties(PotteryBarn.prototype, {
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
        inputActivate: {
            value: function inputActivate(activationContext) {
                activationContext.renderTargetElement.addEventListener("click", this.boundClick);
            }
        },
        activate: {
            value: function activate(activationContext) {
                this.level++;
                var normalizedLevelDifficulty = Math.min(this.level - 1, _maxLevels - 1);
                this.levelDescriptor = _levelDifficulty[normalizedLevelDifficulty];

                var claySprite = new ClaySprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY);

                claySprite.addSymmetricalPoint(1, 0);
                claySprite.addSymmetricalPoint(1, 1);
                claySprite.addSymmetricalPoint(1, 2);

                claySprite.generateTargetShape();

                claySprite.lineWidth = 3;
                this.rootSprite.addNamedChild("claySprite", claySprite);
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);

                // Determine if the player won or lost
                var canContinue = false;
                if (this.rootSprite.claySprite.MatchPercentageToTarget() > .8) {
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


// To Export
function isInView( x, y) {
    return (x > GlobalRuleSet.GameMinX &&
            x < GlobalRuleSet.GameMinX + GlobalRuleSet.GameWidth &&
            y > GlobalRuleSet.GameMinY &&
            y < GlobalRuleSet.GameMinY + GlobalRuleSet.GameHeight);
}