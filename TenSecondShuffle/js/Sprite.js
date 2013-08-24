"use strict";

function Sprite(x, y) {
    this.x = x;
    this.y = y;
    this.parent;
    this.rotation = 0;
    this.scale = 1;
    this.children = [];
}

Sprite.prototype = Object.create(null);
Sprite.prototype.constructor = Sprite;

Object.defineProperties(Sprite.prototype, {
    addChild: {
        value: function addChild(child) {
            if (child.parent) {
                throw new Error("Child cannot be added, already has a parent.");
            }
            this.children.push(child);
            child.parent = this;
        }
    },
    removeChild: {
        value: function removeChild(child) {
            if (child.parent !== this) {
                throw new Error("Can't remove child from this sprite as this is not the correct parent.");
            }
            this.children.splice(this.children.indexOf(child), 1);
            child.parent = null;
        }
    },

    update: {
        value: function update() {
        }
    },
    draw: {
        value: function draw(drawCtx) {
            drawCtx.pushTransform(this);
            this.drawCore(drawCtx);

            var childCount = this.children.length;
            for (var i = 0; i < childCount; i++) {
                this.children[i].draw(drawCtx);
            }

            drawCtx.popTransform();
        }
    },
    drawCore: {
        value: function drawCore(drawCtx) {
            // sprites don't render, derived types should handle this.
        }
    },
});