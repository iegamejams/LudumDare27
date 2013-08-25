"use strict";

function Game(gameRootSprite) {
    this.rootSprite = gameRootSprite;
    this.activated = false;
    this.inputActivated = false;
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
            this.title = gameDescriptor.title;
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
    inputActivate: {
        value: function inputActivate(activationContext) {
            // Attach event handlers here and start playing the game. Should be called before any updates.
            this.inputActivated = true;
        }
    },
    deactivate: {
        value: function deactivate() {
            this.activated = false;
            this.inputActivated = false;

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