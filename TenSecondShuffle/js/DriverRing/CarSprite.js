"use strict";

function CarSprite(x, y, scl) {
    Sprite.call(this, x, y);

    this.fillCar = "red";
    this.stroke = "black";
    this.lineWidth = 1;

    this.scl = scl;
    this.widhToHeighRatio = 1.5;
    this.wheelScl = 10;

    this.rot = 0;
}

CarSprite.prototype = Object.create(Sprite.prototype);
CarSprite.prototype.constructor = CarSprite;

Object.defineProperties(CarSprite.prototype, {
    drawCore: {
        value: function drawCore(drawingContext) {

            var ctx = drawingContext.ctx;

            ctx.beginPath();

            ctx.rotate(this.rot);

            // wheels
            ctx.fillStyle = "gray";
            var scl = this.scl;
            var wheelHalf = this.wheelScl * .5
            ctx.fillRect(-scl - wheelHalf, -scl * this.widhToHeighRatio - wheelHalf, this.wheelScl, this.wheelScl * this.widhToHeighRatio);
            ctx.fillRect(scl - wheelHalf, -scl * this.widhToHeighRatio - wheelHalf, this.wheelScl, this.wheelScl * this.widhToHeighRatio);
            ctx.fillRect(-scl - wheelHalf, scl * this.widhToHeighRatio - wheelHalf, this.wheelScl, this.wheelScl * this.widhToHeighRatio);
            ctx.fillRect(scl - wheelHalf, scl * this.widhToHeighRatio - wheelHalf, this.wheelScl, this.wheelScl * this.widhToHeighRatio);

            // Main Frame

            ctx.fillStyle = this.fillCar;
            ctx.fillRect(-this.scl, -this.scl * 1.5, this.scl * 2, this.scl * 1.5 * 2);


            ctx.fill();
            ctx.stroke();

        }
    },
    setRotation: {
        value: function setRotation(rot) {
            this.rot = rot;
        }
    }
});
