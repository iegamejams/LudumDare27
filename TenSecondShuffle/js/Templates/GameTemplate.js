"use strict";

throw new Error("Template files should never loaded, copy this file and rename as appropriate");

function GameTemplate(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

GameTemplate.prototype = Object.create(Game.prototype);
GameTemplate.prototype.constructor = GameTemplate;

(function initialization_GameTemplate() {

    var _clickHandler = function click(evt) {
        var game = this;
        var rootSprite = this.rootSprite;

        // You can do hit-testing here using Sprite.hitTestSquare or Sprite.hitTestCircle
    }

    Object.defineProperties(GameTemplate.prototype, {
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
                this.boundClick = _clickHandler.bind(this);
            }
        },

        activate: {
            value: function activate(activationContext) {
                Game.prototype.activate.call(this, activationContext);
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