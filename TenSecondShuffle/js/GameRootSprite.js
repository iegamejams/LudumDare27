﻿"use strict";

function GameRootSprite(x, y) {
    Sprite.call(this, x, y);
}

GameRootSprite.prototype = Object.create(Sprite.prototype);
GameRootSprite.prototype.constructor = GameRootSprite;

Object.defineProperties(GameRootSprite.prototype, {
    update: {
        value: function update() {
            if (this.gameObject) {
                this.gameObject.update();
            }
        }
    },

    init: {
        value: function init(gameObject) {
            this.gameObject = gameObject;
        }
    },
});