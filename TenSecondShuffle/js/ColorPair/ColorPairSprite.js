"use strict";

function ColorPairSprite(x, y, color) {
    Sprite.call(this, x, y);

    this.radius = 32;
    this.color = color;
}

ColorPairSprite.prototype = Object.create(Sprite.prototype);
ColorPairSprite.prototype.constructor = ColorPairSprite;

Object.defineProperties(ColorPairSprite.prototype, {
    drawCore: {
        value: function drawCore(drawingCtx) {
            var ctx = drawingCtx.ctx; // Break of the isolation model, go directly to canvas 2D

            ctx.fillStyle = this.color;

            ctx.fillRect(-32, -32, 64, 64);
            ctx.strokeRect(-32, -32, 64, 64);
        }
    }
});