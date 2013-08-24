"use strict";

function FrameSprite(x, y, frame) {
    Sprite.call(this, x, y);

    this.frame = frame;
}

// Should be FrameSprite.prototype when written
FrameSprite.prototype = Object.create(Sprite.prototype);
FrameSprite.prototype.constructor = FrameSprite;

Object.defineProperties(FrameSprite.prototype, {
    drawCore: {
        value: function drawCore(drawCtx) {
            drawCtx.drawFrame(this.frame);
        }
    }
});