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

        if (isInView(x, y) && this.isShapeMatched == false) {
            SoundManager.play("weeble");
            this.rootSprite.claySprite.updateTouch(x, y);
        }
    }

    Object.defineProperties(PotteryBarn.prototype, {
        update: {
            value: function update() {
                this.isShapeMatched = (this.rootSprite.claySprite.getAverageDistToTarget() < 4);
            }
        },

        init: {
            value: function init(gameDescriptor) {
                Game.prototype.init.call(this, gameDescriptor);

                this.level = 0;
                this.boundClick = _clickHandler.bind(this);
                this.isShapeMatched = false;
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
                Game.prototype.activate.call(this, activationContext);

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

                this.isShapeMatched = false;
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                Game.prototype.deactivate.call(this, activationContext);

                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);
                activationContext.renderTargetElement.removeEventListener("touchstart", this.boundClick);

                // Shape grading.
                this.isShapeMatched = (this.rootSprite.claySprite.getAverageDistToTarget() < 4);

                // Determine if the player won or lost
                var canContinue = false;
                if (this.isShapeMatched) {
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
