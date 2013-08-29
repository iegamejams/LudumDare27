"use strict";

function Game(gameRootSprite) {
    this.rootSprite = gameRootSprite;
    this.activated = false;
    this.inputActivated = false;
    this.level = 0;
    this.score = 0;
    this.earlyWin = false;
}

Game.prototype = Object.create(null);
Game.prototype.constructor = Game;

Object.defineProperties(Game.prototype, {
    showLevel: {
        value: true
    },
    showScore: {
        value: true
    },
    showWinOverlay: {
        value: false
    },

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
            this.earlyWin = false;
            this.bonusFrames = 0;
            this.bonusScore = 0;
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
            this.earlyWin = false;
            this.activated = false;
            this.inputActivated = false;
            this.score += this.bonusScore;

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

// To Export
function isInView(x, y, border) {
    if (typeof border === 'undefined') border = 0;
    return (x > GlobalRuleSet.GameMinX + border &&
            x < GlobalRuleSet.GameMinX + GlobalRuleSet.GameWidth - border &&
            y > GlobalRuleSet.GameMinY +border &&
            y < GlobalRuleSet.GameMinY + GlobalRuleSet.GameHeight - border);
}