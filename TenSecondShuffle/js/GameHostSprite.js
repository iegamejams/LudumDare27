"use strict";

function GameHostSprite(activationContext, x, y) {
    Sprite.call(this, x, y);

    this.activationContext = activationContext;
    this.reset();
}

GameHostSprite.prototype = Object.create(Sprite.prototype);
GameHostSprite.prototype.constructor = GameHostSprite;

Object.defineProperties(GameHostSprite.prototype, {
    GAME_SWITCH_TIME: {
        value: 60 * 10 // 60 fps at 10 seconds
    },

    reset: {
        value: function reset() {
            this.disabled = false;
            this.currentGame = -1;
            this.currentFrame = 0;
        }
    },

    update: {
        value: function update() {
            if (!this.disabled && this.children.length > 0) {
                if (this.currentFrame % GlobalRuleSet.GAME_SWITCH_FRAMES === 0) {
                    var canContinue = true;
                    if (this.currentGame !== -1) {
                        canContinue = this.children[this.currentGame].deactivate(this.activationContext);
                    }

                    if (canContinue) {
                        this.currentGame = (this.currentGame + 1) % this.children.length;
                        this.children[this.currentGame].activate(this.activationContext);

                        // Put game switch time logic in here.
                    }
                    else {
                        this.disabled = true;
                    }
                }
                else {
                    this.children[this.currentGame].update();
                }
                this.currentFrame++;
            }
        }
    },

    draw: {
        value: function draw(drawingContext) {
            if (!this.disabled && this.children.length > 0 && this.currentGame >= 0) {
                this.children[this.currentGame].draw(drawingContext);
            }
            this.drawCore(drawingContext);
        }
    },
    drawCore: {
        value: function drawCore(drawingContext) {
            drawingContext.ctx.strokeStyle = "black";
            drawingContext.ctx.strokeRect(GlobalRuleSet.GameMinX, GlobalRuleSet.GameMinY, GlobalRuleSet.GameWidth, GlobalRuleSet.GameHeight);
       }
    },
});