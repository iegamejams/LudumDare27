﻿"use strict";

function PotteryBarn(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

PotteryBarn.prototype = Object.create(Game.prototype);
PotteryBarn.prototype.constructor = PotteryBarn;

(function initialization_PotteryBarn() {
    var _clickHandler = function click(evt) {
        evt.preventDefault();

        var x = evt.offsetX, y = evt.offsetY;

        if (!(typeof evt.changedTouches === 'undefined')) {
            x = evt.changedTouches[0];
            y = evt.changedTouches[1];
        }

        if (isInView(evt.offsetX, evt.offsetY)) {
            SoundManager.play("weeble");
            this.rootSprite.claySprite.updateTouch(x, y);
        }
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
                activationContext.renderTargetElement.addEventListener("touchstart", this.boundClick);
                SoundManager.play("wobble");
            }
        },
        activate: {
            value: function activate(activationContext) {
                this.level++;
                var claySprite = new ClaySprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY);

                var step = 1;
                if (this.level > 3) {
                    step = 2;
                }
                else if (this.level > 6) {
                    step = 3;
                }

                for (var i = 0; i < 3; i += 1 / step) {
                    claySprite.addSymmetricalPoint(1, i);
                }

                claySprite.generateTargetShape();

                claySprite.lineWidth = 3;
                this.rootSprite.addNamedChild("claySprite", claySprite);
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);
                activationContext.renderTargetElement.removeEventListener("touchstart", this.boundClick);

                // Determine if the player won or lost
                var canContinue = false;
                if (this.rootSprite.claySprite.getAverageDistToTarget() < 5) {
                    this.score += this.level * 2500;
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