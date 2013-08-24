"use strict";

function Arkanoid() {
    this.drawingContext = null;
    this.rootSprite = null;
    this.hudElement = null;

    this.imgSquare = document.getElementById("imgSquare");

}

Arkanoid.prototype = Object.create(null);
Arkanoid.prototype.constructor = Arkanoid;

Object.defineProperties(Arkanoid.prototype, {
    init: {
        value: function init(target) {
            this.drawingContext = new DrawingContext2D(target);
        }
    },
    setupGame: {
        value: function setupGame() {
            this.rootSprite = new Sprite(0, 0, null);

            this.rootSprite.backgroundLayer = new Sprite(0, 0, null);
            this.rootSprite.gameHostLayer = new Sprite(0, 0, null);
            this.rootSprite.hudLayer = new Sprite(0, 0, null);

            this.hudElement = new ImageSprite(this.drawingContext.width / 2, this.drawingContext.height / 2, this.imgSquare);
            this.rootSprite.hudLayer.addChild(this.hudElement);

            this.rootSprite.addChild(this.rootSprite.hudLayer);
            this.drawingContext.rootSprite = this.rootSprite;
        }
    },

    render: {
        value: function render() {
            this.update();
            this.draw();

        }
    },

    update: {
        value: function update() {
            this.drawingContext.rootSprite.hudLayer.x = Math.cos(new Date() / 1000) * 100;
            this.drawingContext.rootSprite.hudLayer.y = Math.sin(new Date() / 1000) * 100;

            this.drawingContext.rootSprite.update();
        }
    },

    draw: {
        value: function draw() {
            this.drawingContext.beginDraw();
            this.drawingContext.clear();
            this.drawingContext.rootSprite.draw(this.drawingContext);
            this.drawingContext.endDraw();
        }
    }
}
);

