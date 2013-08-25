"use strict";

function GameRootSprite(x, y) {
    Sprite.call(this, x, y);

    this.activated = false;
    this.titleImageSprite;
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
            else {
                // If we aren't activated then we can just show a simple overlay window instead.
                drawingContext.pushTransform(this);
                if (!this.titleImagesprite) {
                    this.titleImageSprite = new ImageSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, this.gameObject.titleImage);
                }
                this.titleImageSprite.draw(drawingContext);
                drawingContext.popTransform(this);
            }
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