"use strict";

function FillSprite(x, y, width, height, fill) {
    Sprite.call(this, x, y);

    this.width = width;
    this.height = height;
    this.fill = fill;
}

FillSprite.prototype = Object.create(Sprite.prototype);
FillSprite.prototype.constructor = FillSprite;

Object.defineProperties(FillSprite.prototype, {
    drawCore: {
        value: function drawCore(drawingContext) {
            var ctx = drawingContext.ctx;
            
            ctx.fillStyle = this.fill;
            ctx.fillRect(0, 0, this.width, this.height);
        }
    },
    hitTest: {
        value: function hitTest(x, y) {
            if (x >= this.x && x <= (this.x + this.width) && y >= this.y && y <= (this.y + this.height)) {
                return true;
            }
            return false;
        }
    },
});
