"use strict";

function GameRootSprite(x, y) {
    Sprite.call(this, x, y);

    this.activated = false;
    this.titleImageSprite;
    this.titleSprite;
    this.helpSprite;
}

GameRootSprite.prototype = Object.create(Sprite.prototype);
GameRootSprite.prototype.constructor = GameRootSprite;

Object.defineProperties(GameRootSprite.prototype, {
    update: {
        value: function update() {
            if (this.gameObject) {
                this.gameObject.update();
            }
        }
    },
    init: {
        value: function init(gameObject) {
            this.gameObject = gameObject;
        }
    },

    draw: {
        value: function draw(drawingContext) {
            if (this.activated) {
                Sprite.prototype.draw.call(this, drawingContext);
            }

            if (!this.titleSprite) {
                this.titleSprite = new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.TitleY, this.gameObject.title, GlobalRuleSet.TitleFont);
                this.helpSprite = new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.HelpTitleY, this.gameObject.help, GlobalRuleSet.HelpTitleFont);
            }
            drawingContext.pushTransform(this);
            if (!this.activated) {
                // If we aren't activated then we can just show a simple overlay window instead.
                if (!this.titleImagesprite) {
                    this.titleImageSprite = new ImageSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, this.gameObject.titleImage);
                }
                this.titleImageSprite.draw(drawingContext);
            }
            this.titleSprite.draw(drawingContext);
            this.helpSprite.draw(drawingContext);
            drawingContext.popTransform();
        }
    },

    activate: {
        value: function activate(activationContext) {
            console.log("Activated: " + this.gameObject.constructor);
            this.activated = true;
            if (this.gameObject) {
                this.gameObject.activate(activationContext);
            }
        }
    },
    deactivate: {
        value: function deactivate(activationContext) {
            this.activated = false;
            if (this.gameObject) {
                return this.gameObject.deactivate(activationContext);
            }
            else {
                return true;
            }
        }
    },
});