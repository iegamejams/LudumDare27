"use strict";

function GameRootSprite(x, y) {
    Sprite.call(this, x, y);

    this.activated = false;
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
            this.updateScore();
            if (this.gameObject.earlyWin) {
                this.gameObject.bonusFrames++;

                var n = this.gameObject.bonusFrames;
                var ratio = 10 / this.gameObject.level;
                var n_1 = 1 / ratio;

                this.gameObject.bonusScore = Math.floor((n / 2) * (n / ratio + n_1));
                this.winOverlay.bonus.changeText(this.gameObject.bonusScore.toString());
            }
        }
    },
    updateScore: {
        value: function updateScore() {
            if (this.scoreSprite && this.scoreSprite.score !== this.gameObject.score) {
                this.scoreSprite.changeText("Score: " + this.gameObject.score);
                this.scoreSprite.score = this.gameObject.score;
            }
        }
    },
    updateLevel: {
        value: function updateLevel() {
            if (this.levelSprite && this.levelSprite.level !== this.gameObject.level) {
                this.levelSprite.changeText("Level: " + this.gameObject.level);
                this.levelSprite.level = this.gameObject.level;
            }
        }
    },
    init: {
        value: function init(gameObject) {
            this.gameObject = gameObject;
            this.titleSprite = new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.TitleY, this.gameObject.title, GlobalRuleSet.TitleFont);
            this.helpSprite = new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.HelpTitleY, this.gameObject.help, GlobalRuleSet.HelpTitleFont);
            this.winOverlay = new OverlaySprite("transparent");

            this.winOverlay.addChild(new FillSprite(GlobalRuleSet.GameCenterX - 150, GlobalRuleSet.GameCenterY - 20, 300, 50, "beige"));
            this.winOverlay.addChild(new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, "Winner!", "bold 18pt Calibri"));
            this.winOverlay.addChild(new FillSprite(GlobalRuleSet.GameCenterX - 150, GlobalRuleSet.GameCenterY + 40, 300, 50, "beige"));
            this.winOverlay.addNamedChild("bonusTitle", new TextSprite(GlobalRuleSet.GameCenterX - 130, GlobalRuleSet.GameCenterY + 60, "Bonus Score:", GlobalRuleSet.UIFont));
            this.winOverlay.bonusTitle.alignment = "left";
            this.winOverlay.addNamedChild("bonus", new TextSprite(GlobalRuleSet.GameCenterX + 130, GlobalRuleSet.GameCenterY + 60, "", GlobalRuleSet.UIFont));
            this.winOverlay.bonus.alignment = "right";

            if (this.gameObject.showLevel) {
                this.levelSprite = new TextSprite(GlobalRuleSet.GameMinX + 20, GlobalRuleSet.TitleY, "", GlobalRuleSet.UIFont);
                this.levelSprite.alignment = "left";
            }
            if (this.gameObject.showScore) {
                this.scoreSprite = new TextSprite(GlobalRuleSet.GameMinX + 20, GlobalRuleSet.HelpTitleY, "", GlobalRuleSet.UIFont);
                this.scoreSprite.alignment = "left";
            }
        }
    },

    draw: {
        value: function draw(drawingContext) {
            Sprite.prototype.draw.call(this, drawingContext);

            drawingContext.pushTransform(this);
            this.titleSprite.draw(drawingContext);
            this.helpSprite.draw(drawingContext);
            if (this.levelSprite) {
                this.levelSprite.draw(drawingContext);
            }
            if (this.scoreSprite) {
                this.scoreSprite.draw(drawingContext);
            }
            if (this.gameObject.showWinOverlay && this.gameObject.earlyWin) {
                this.winOverlay.draw(drawingContext);
            }
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
            this.updateLevel();
            this.updateScore();
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