"use strict";

function Game(gameRootSprite) {
    this.rootSprite = gameRootSprite;
    this.activated = false;
}

Game.prototype = Object.create(null);
Game.prototype.constructor = Game;

Object.defineProperties(Game.prototype, {
    update: {
        value: function update() {
        }
    },

    init: {
        value: function init(gameDescriptor) {
            this.title = gameDescriptor.id;
            this.help = gameDescriptor.help;
            this.titleImage = gameDescriptor.titleImage;
        }
    },

    activate: {
        value: function activate() {
            this.activated = true;
            // Long running games will likely have additional state controlling where they are in the game.
            // Short running games will want to initialize their next level here.
        }
    },
    deactivate: {
        value: function deactivate() {
            this.activated = false;

            // Long running games will likely ignore this state.
            // Short running games will clean up any resources they've allocated.

            // Return true for continue playing, return false to say this game has ended
            return true;
        }
    },

    getLeaderboardScore: {
        value: function getLeaderboardScore() {
        }
    }
});