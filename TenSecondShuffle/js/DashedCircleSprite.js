"use strict";

function DashedCircleSprite(x, y, initialRadius) {
    CircleSprite.call(this, x, y, initialRadius);
}

DashedCircleSprite.prototype = Object.create(CircleSprite.prototype);
DashedCircleSprite.prototype.constructor = DashedCircleSprite;

Object.defineProperties(DashedCircleSprite.prototype, {
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

                    for (var i = 0; i < 24; i += 2) {
                        ctx.beginPath();
                        ctx.arc(0, 0, this.radius, Math.PI / 12 * i, Math.PI / 12 * (i + 1));
                        ctx.stroke();
                    }
                }
            }
        }
    }
});