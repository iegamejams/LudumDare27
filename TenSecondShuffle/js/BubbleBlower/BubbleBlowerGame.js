"use strict";

function BubbleBlowerGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

BubbleBlowerGame.prototype = Object.create(Game.prototype);
BubbleBlowerGame.prototype.constructor = BubbleBlowerGame;

(function initialization_BubbleBlowerGame() {
    var _pumpArea = 400;
    var _levelDifficulty = [
        { radius: 30, pop: 40, airLoss: _pumpArea / 48 },
        { radius: 35, pop: 42, airLoss: _pumpArea / 45 },
        { radius: 40, pop: 46, airLoss: _pumpArea / 42 },
        { radius: 50, pop: 55, airLoss: _pumpArea / 39 },
        { radius: 60, pop: 64, airLoss: _pumpArea / 36 },
        { radius: 75, pop: 78, airLoss: _pumpArea / 30 },
    ];
    var _maxLevels = _levelDifficulty.length;
    var _clickHandler = function click(evt) {
        if (!this.popped) {
            this.area += _pumpArea;
        }
    }

    Object.defineProperties(BubbleBlowerGame.prototype, {
        update: {
            value: function update() {
                if (!this.popped) {
                    // Animation update loop, this is the only callback per frame the game will get so it needs to set up the visual tree
                    // now so that when the rendering occurs everything is reflected already.
                    this.area = Math.max(0, this.area - this.levelDescriptor.airLoss);
                    this.radius = Math.sqrt(this.area / Math.PI);

                    var bubbleSprite = this.rootSprite.bubble;

                    bubbleSprite.radius = this.radius;
                    if (this.radius < this.levelDescriptor.radius) {
                        bubbleSprite.fill = "pink";
                        bubbleSprite.stroke = "deeppink";
                    }
                    else if (this.radius < this.levelDescriptor.pop) {
                        bubbleSprite.fill = "lightgreen";
                        bubbleSprite.stroke = "darkgreen";
                    }
                    else {
                        bubbleSprite.fill = "red";
                        bubbleSprite.stroke = "darkred";
                        this.popped = true;
                    }
                }
            }
        },

        init: {
            value: function init() {
                // This is called once at the beginning when we initialize all of the games currently. May get called more if we introduce a reset functionality to play more than once.
                this.area = 0;
                this.radius = 0;
                this.level = 0;
                this.popped = false;

                this.boundClick = _clickHandler.bind(this);
            }
        },

        activate: {
            value: function activate(activationContext) {
                this.level++;
                var normalizedLevelDifficulty = Math.min(this.level - 1, _maxLevels - 1);
                this.levelDescriptor = _levelDifficulty[normalizedLevelDifficulty];

                this.area = 0;
                var bubbleSprite = new CircleSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, 0);
                bubbleSprite.lineWidth = 3;

                var targetSprite = new DashedCircleSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, this.levelDescriptor.pop);
                targetSprite.fill = "transparent";
                targetSprite.stroke = "red";

                this.rootSprite.addNamedChild("bubble", bubbleSprite);
                this.rootSprite.addChild(targetSprite);

                activationContext.renderTargetElement.addEventListener("click", this.boundClick);
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);

                // Determine if the player won or lost
                var canContinue = false;
                if (!this.popped && this.radius >= this.levelDescriptor.radius) {
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