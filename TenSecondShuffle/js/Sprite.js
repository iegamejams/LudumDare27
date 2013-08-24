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
    addNamedChild: {
        value: function addNamedChild(name, child) {
            if (!this[name]) {
                this.addChild(child);
                child.name = name;
                this[name] = child;
            }
            else {
                throw new Error("Named child " + name + " already exists.");
            }
        }
    },
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

            if (child.name) {
                delete this[child.name];
            }

            this.children.splice(this.children.indexOf(child), 1);
            child.parent = null;
            child.name = undefined;
        }
    },
    removeAllChildren: {
        value: function removeAllChildren() {
            var childCount = this.children.length;
            for (var i = 0; i < childCount; i++) {
                var child = this.children[i];
                if (child.name) {
                    delete this[child.name];
                }
            }
            this.children = [];
        }
    },

    update: {
        value: function update() {
            var childCount = this.children.length;
            for (var i = 0; i < childCount; i++) {
                this.children[i].update();
            }
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

    hitTestRadius: {
        value: function hitTestRadius(x, y, radius) {
        }
    },
    hitTestSquare: {
        value: function hitTestSquare(x, y, halfWidth) {
            var childCount = this.children.length;
            for (var i = childCount - 1; i >= 0; i--) {
                var child = this.children[i];
                if ((child.x - halfWidth) <= x &&
                    (child.x + halfWidth) >= x &&
                    (child.y - halfWidth) <= y &&
                    (child.y + halfWidth) >= y) {
                    return child;
                }
            }
            return null;
        }
    }
});