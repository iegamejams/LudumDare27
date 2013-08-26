"use strict";

function GameRootSprite(x, y) {
    Sprite.call(this, x, y);

    this.activated = false;
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
            Sprite.prototype.update.call(this);
        }
    },
    init: {
        value: function init(gameObject) {
            this.gameObject = gameObject;
            this.titleSprite = new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.TitleY, this.gameObject.title, GlobalRuleSet.TitleFont);
            this.helpSprite = new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.HelpTitleY, this.gameObject.help, GlobalRuleSet.HelpTitleFont);
        }
    },

    draw: {
        value: function draw(drawingContext) {
            Sprite.prototype.draw.call(this, drawingContext);

            drawingContext.pushTransform(this);
            this.titleSprite.draw(drawingContext);
            this.helpSprite.draw(drawingContext);
            drawingContext.popTransform();
        }
    },
    drawCore: {
        value: function drawCore(drawingContext) {
            drawingContext.ctx.strokeStyle = "black";
            drawingContext.ctx.strokeRect(GlobalRuleSet.GameMinX, GlobalRuleSet.GameMinY, GlobalRuleSet.GameWidth, GlobalRuleSet.GameHeight);
            drawingContext.ctx.fillRect(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameMinY + GlobalRuleSet.GameHeight, 1, GlobalRuleSet.GameHostHeight - GlobalRuleSet.GameHeight);
        }
    },

    activate: {
        value: function activate(activationContext) {
            this.activated = true;
            if (this.gameObject) {
                this.gameObject.activate(activationContext);
            }
        }
    },
    inputActivate: {
        value: function inputActivate(activationContext) {
            if (this.gameObject) {
                this.gameObject.inputActivate(activationContext);
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