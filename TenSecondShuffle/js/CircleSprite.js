"use strict";

function CircleSprite(x, y, initialRadius) {
    Sprite.call(this, x, y);

    this.radius = initialRadius;
    this.fill = "black";
    this.stroke = "black";
    this.lineWidth = 1;
}

CircleSprite.prototype = Object.create(Sprite.prototype);
CircleSprite.prototype.constructor = CircleSprite;

Object.defineProperties(CircleSprite.prototype, {
    drawCore: {
        value: function drawCore(drawingContext) {
            if (this.radius > 0) {
                var ctx = drawingContext.ctx;

                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
                ctx.fillStyle = this.fill;
                ctx.fill();

                if (this.fill !== this.stroke) {
                    ctx.strokeStyle = this.stroke;
                    if (this.lineWidth !== 1) {
                        ctx.lineWidth = this.lineWidth;
                    }
                    ctx.stroke();
                }
            }
        }
    },
});