"use strict";

function MemoryGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

MemoryGame.prototype = Object.create(Game.prototype);
MemoryGame.prototype.constructor = MemoryGame;

(function initialization_MemoryGame() {
    var _cards = [
        "imgMemoryCat", "imgMemoryLion", "imgMemorySnake", "imgMemorySwan",
        "imgMemoryTurtle", "imgMemoryVulture", "imgMemoryWasp", "imgMemoryWolf"
    ];
    var _levelDifficulty = [
        3, 4, 5, 6, 7, 8
    ];
    var _maxLevels = _levelDifficulty.length;

    var _clickHandler = function click(evt) {
        var game = this;
        var rootSprite = this.rootSprite;

        var hitSprite = rootSprite.hitTestSquare(evt.offsetX, evt.offsetY, 32);
        if (hitSprite) {
            if (this.previousSprite) {
                this.previousSprite.flip();
                if (this.previousSprite !== hitSprite) {
                    if (this.previousSprite.image === hitSprite.image) {
                        this.rootSprite.removeChild(this.previousSprite);
                        this.rootSprite.removeChild(hitSprite);
                        hitSprite = null;
                    }
                }
            }
            this.previousSprite = hitSprite;
            if (this.previousSprite) {
                this.previousSprite.flip();
            }
        }
    }

    Object.defineProperties(MemoryGame.prototype, {
        update: {
            value: function update() {
                // Animation update loop, this is the only callback per frame the game will get so it needs to set up the visual tree
                // now so that when the rendering occurs everything is reflected already.
            }
        },

        init: {
            value: function init(gameDescriptor) {
                Game.prototype.init.call(this, gameDescriptor);

                // This is called once at the beginning when we initialize all of the games currently. May get called more if we introduce
                // a reset functionality to play more than once.
                this.level = 0;
                this.boundClick = _clickHandler.bind(this);
            }
        },

        activate: {
            value: function activate(activationContext) {
                Game.prototype.activate.call(this, activationContext);

                this.level++;
                var normalizedLevelDifficulty = Math.min(this.level - 1, _maxLevels - 1);
                var levelDescriptor = _levelDifficulty[normalizedLevelDifficulty];

                var unshuffledCards = [];
                for (var i = 0; i < levelDescriptor; i++) {
                    var card1 = new CardSprite(0, 0, document.getElementById(_cards[i]));
                    var card2 = new CardSprite(0, 0, document.getElementById(_cards[i]));

                    unshuffledCards.push(card1);
                    unshuffledCards.push(card2);

                    this.rootSprite.addChild(card1);
                    this.rootSprite.addChild(card2);
                }

                this.cards = [];
                while (unshuffledCards.length > 0) {
                    this.cards.push(unshuffledCards.splice(Math.randomIntIndex(unshuffledCards.length), 1)[0]);
                }
                var rows = Math.ceil(this.cards.length / 4);
                var currentRow = -Math.ceil(rows / 2);

                for (var i = 0; i < rows; i++) {
                    var rowOffset = i * 4;
                    var xOffset = -2;
                    if (i == (rows - 1) && this.cards.length % 4 !== 0) {
                        xOffset = -1;
                    }
                    for (var j = 0; j < 4; j++) {
                        var card = this.cards[rowOffset + j];
                        if (card) {
                            card.x = GlobalRuleSet.GameCenterX + 50 + (xOffset + j) * 100;
                            card.y = GlobalRuleSet.GameCenterY + 50 + currentRow * 100;
                        }
                    }
                    currentRow++;
                }

            }
        },
        inputActivate: {
            value: function inputActivate(activationContext) {
                Game.prototype.inputActivate.call(this, activationContext);

                activationContext.renderTargetElement.addEventListener("click", this.boundClick);
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                Game.prototype.deactivate.call(this, activationContext);

                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);

                // Determine if the player won or lost
                var canContinue = false;
                if (this.rootSprite.children.length === 0) {
                    canContinue = true;
                }

                this.rootSprite.removeAllChildren();
                return canContinue;
            }
        },

        getLeaderboardScore: {
            value: function getLeaderboardScore() {
            }
        }
    });
})();