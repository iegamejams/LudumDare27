"use strict";

function DriverRing(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

DriverRing.prototype = Object.create(Game.prototype);
DriverRing.prototype.constructor = DriverRing;

(function initialization_DriverRing() {
    var _clickHandler = function click(evt) {

    }

    Object.defineProperties(DriverRing.prototype, {
        update: {
            value: function update() {

            }
        },

        init: {
            value: function init(gameDescriptor) {
                Game.prototype.init.call(this, gameDescriptor);

                this.boundClick = _clickHandler.bind(this);
            }
        },

        activate: {
            value: function activate(activationContext) {
                this.level++;

            }
        },
        inputActivate: {
            value: function inputActivate(activationContext) {
                activationContext.renderTargetElement.addEventListener("click", this.boundClick);
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);

                // Determine if the player won or lost
                var canContinue = false;
                if (true) {
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