"use strict";

function CarSprite(x, y) {
    Sprite.call(this, x, y);

    this.fill = "black";
    this.stroke = "black";
    this.lineWidth = 1;
}

CarSprite.prototype = Object.create(Sprite.prototype);
CarSprite.prototype.constructor = CarSprite;

Object.defineProperties(CarSprite.prototype, {
    drawCore: {
        value: function drawCore(drawingContext) {
            this.beginPath();


            this.stroke();
        }
    },
});
