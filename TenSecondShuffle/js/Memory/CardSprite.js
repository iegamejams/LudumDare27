"use strict";

function CardSprite(x, y, image) {
    Sprite.call(this, x, y);

    this.image = image;
    this.imageSprite = new ImageSprite(0, 0, this.image);
    this.flipped = false;
}

CardSprite.prototype = Object.create(Sprite.prototype);
CardSprite.prototype.constructor = CardSprite;

Object.defineProperties(CardSprite.prototype, {
    flip: {
        value: function flip() {
            if (this.flipped) {
                this.flipped = false;
                this.removeChild(this.imageSprite);
            }
            else {
                this.flipped = true;
                this.addChild(this.imageSprite);
            }
        }
    },

    drawCore: {
        value: function drawCore(drawingContext) {
            var halfWidth = 32;
            var halfHeight = 32;
            var radius = 8;

            var x = -halfWidth;
            var y = -halfWidth;

            var ctx = drawingContext.ctx;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(halfWidth, y, halfWidth, y + radius, radius);
            ctx.arcTo(halfWidth, halfHeight, halfWidth - radius, halfHeight, radius);
            ctx.arcTo(x, halfHeight, x, halfHeight - radius, radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.fillStyle = "lightblue";
            ctx.fill();
        }
    },
});