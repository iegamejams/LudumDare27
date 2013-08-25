"use strict";

function ClickSequenceSprite(itemNumber, x, y) {
    CircleSprite.call(this, x, y, 32);

    this.itemNumber = itemNumber;
    this.fill = "lightblue";
    this.stroke = "darkblue";
    this.lineWidth = 2;
}

ClickSequenceSprite.prototype = Object.create(CircleSprite.prototype);
ClickSequenceSprite.prototype.constructor = ClickSequenceSprite;

Object.defineProperties(ClickSequenceSprite.prototype, {
    drawCore: {
        value: function drawCore(drawingCtx) {
            var ctx = drawingCtx.ctx; // Break of the isolation model, go directly to canvas 2D

            CircleSprite.prototype.drawCore.call(this, drawingCtx);

            ctx.font = "bold 12pt Courier New";
            if (!this._measuredText) {
                this._measuredTextOffset = ctx.measureText(this.itemNumber).width * -0.5;
            }
            ctx.fillStyle = "black";
            ctx.fillText(this.itemNumber, this._measuredTextOffset, 6);
        }
    }
});