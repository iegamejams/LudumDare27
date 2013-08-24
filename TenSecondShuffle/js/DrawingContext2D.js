"use strict";

function DrawingContext2D(canvas) {
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
}

DrawingContext2D.prototype = Object.create(null);
DrawingContext2D.prototype.constructor = DrawingContext2D;

Object.defineProperties(DrawingContext2D.prototype, {
    pushTransform: {
        value: function pushTransform(transform) {
            var ctx = this.ctx;
            ctx.save();

            if (transform.x !== 0 || transform.y !== 0) {
                ctx.translate(transform.x, transform.y);
            }

            var scale = transform.scale;
            if (scale !== 1.0) {
                ctx.scale(scale, scale);
            }

            var rotation = transform.rotation;
            if (rotation !== 0) {
                ctx.rotate(rotation);
            }
        }
    },
    popTransform: {
        value: function popTransform() {
            this.ctx.restore();
        }
    },
    clear: {
        value: function clear() {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    },

    drawFrame: {
        value: function drawFrame(frame) {
            this.ctx.drawImage(frame.image, frame.sourceX, frame.sourceY, frame.sourceWidth, frame.sourceHeight, -frame.centerX, -frame.centerY, frame.sourceWidth, frame.sourceHeight);
        }
    },

    beginDraw: {
        value: function beginDraw() {
            this.ctx.save();
        }
    },
    endDraw: {
        value: function endDraw() {
            this.ctx.restore();
        }
    },
});