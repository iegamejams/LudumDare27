"use strict";

function Game(gameRootSprite) {
    this.rootSprite = gameRootSprite;
}

Game.prototype = Object.create(null);
Game.prototype.constructor = Game;

Object.defineProperties(Game.prototype, {
    update: {
        value: function update() {
        }
    }
});