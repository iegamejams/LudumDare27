"use strict";

function TextSprite(x, y, text, font) {
    Sprite.call(this, x, y);

    this.text = text;
    this.font = font || "12pt Calibri";
}

TextSprite.prototype = Object.create(Sprite.prototype);
TextSprite.prototype.constructor = TextSprite;

Object.defineProperties(TextSprite.prototype, {
    changeText: {
        value: function changeText(newText) {
            this.text = newText;
            this._measureText = false;
        }
    },
    changeFont: {
        value: function changeFont(newFont) {
            this.font = newFont;
            this._measureText = false;
            this._measureFont = false;
        }
    },
    drawCore: {
        value: function drawCore(drawingContext) {
            if (this.text && this.text.length > 0) {
                var ctx = drawingContext.ctx;

                ctx.font = this.font;
                if (!this._measureFont) {
                    this._textOffsetY = ctx.measureText("M").width / 2;
                    this._measureFont = true;
                }
                if (!this._measureText) {
                    this._textOffsetX = -ctx.measureText(this.text).width / 2;
                    this._measureText = true;
                }

                ctx.fillStyle = "black";
                ctx.fillText(this.text, this._textOffsetX, this._textOffsetY);
            }
        }
    },
});