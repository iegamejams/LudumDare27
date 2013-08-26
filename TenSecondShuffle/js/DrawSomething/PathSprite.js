"use strict";

function PathSprite(x, y, stroke) {
    Sprite.call(this, x, y);
    
    this.stroke = stroke;
    this.points = [];
}

PathSprite.prototype = Object.create(Sprite.prototype);
PathSprite.prototype.constructor = PathSprite;

Object.defineProperties(PathSprite.prototype, {
    addPoint: {
        value: function addPoint(point) {
            this.points.push(point);
        }
    },

    drawCore: {
        value: function drawCore(drawingContext) {
            if (this.points.length >= 2) {
                var ctx = drawingContext.ctx;

                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);

                var pointCount = this.points.length;
                for (var i = 1; i < pointCount; i++) {
                    var point = this.points[i];
                    ctx.lineTo(point.x, point.y);
                }
                ctx.strokeStyle = this.stroke;
                ctx.stroke();
            }
        }
    },
});