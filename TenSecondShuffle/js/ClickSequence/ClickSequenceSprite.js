"use strict";

function ClickSequenceSprite(itemNumber, x, y) {
    Sprite.call(this, x, y);

    this.itemNumber = itemNumber;
    this.radius = 32;
}

ClickSequenceSprite.prototype = Object.create(Sprite.prototype);
ClickSequenceSprite.prototype.constructor = ClickSequenceSprite;

Object.defineProperties(ClickSequenceSprite.prototype, {
    drawCore: {
        value: function drawCore(drawingCtx) {
            var ctx = drawingCtx.ctx; // Break of the isolation model, go directly to canvas 2D

            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = "darkblue";
            ctx.fillStyle = "lightblue";
            ctx.fill();
            ctx.stroke();

            ctx.font = "bold 12pt Courier New";
            if (!this._measuredText) {
                this._measuredTextOffset = ctx.measureText(this.itemNumber).width * -0.5;
            }
            ctx.fillStyle = "black";
            ctx.fillText(this.itemNumber, this._measuredTextOffset, 6);
        }
    }
});