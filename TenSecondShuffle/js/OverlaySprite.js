"use strict";

function OverlaySprite(fill) {
    Sprite.call(this, 0, 0);

    this.fill = fill;
}

OverlaySprite.prototype = Object.create(Sprite.prototype);
OverlaySprite.prototype.constructor = OverlaySprite;

Object.defineProperties(OverlaySprite.prototype, {
    drawCore: {
        value: function drawCore(drawingContext) {
            var ctx = drawingContext.ctx;

            ctx.fillStyle = this.fill;
            ctx.fillRect(0, 0, drawingContext.width, drawingContext.height);
        }
    }
});