"use strict";

function NyanCatGame(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

NyanCatGame.prototype = Object.create(Game.prototype);
NyanCatGame.prototype.constructor = NyanCatGame;

(function initialization_NyanCatGame() {

    var _clickHandler = function click(evt) {
        var game = this;
        var rootSprite = this.rootSprite;

        if (evt.offsetY > this.nyanSprite.y) {
            this.nyanSprite.y += 5;
        }
        else {
            this.nyanSprite.y -= 5;
        }

        // You can do hit-testing here using Sprite.hitTestSquare or Sprite.hitTestCircle
    }
    function _callbackUpdateRainbow(sprite, frameIndex) {
        var yOffset = 0;
        if (frameIndex > 1) {
            yOffset = 3;
        }

        var rainbowCount = this.rainbowSprites.length;
        for (var i = rainbowCount - 1; i >= 1; i--) {
            this.rainbowSprites[i].y = this.rainbowSprites[i - 1].y;
        }
        this.rainbowSprites[0].y = sprite.y + yOffset;
    }

    Object.defineProperties(NyanCatGame.prototype, {
        update: {
            value: function update() {
                for (var i = 0; i < this.starSprites.length; i++) {
                    var starSprite = this.starSprites[i];
                    starSprite.x -= 2;
                    
                    if (starSprite.x <= GlobalRuleSet.GameMinX) {
                        starSprite.x = GlobalRuleSet.GameMinX + GlobalRuleSet.GameWidth;
                    }
                }
            }
        },

        init: {
            value: function init(gameDescriptor) {
                Game.prototype.init.call(this, gameDescriptor);

                // This is called once at the beginning when we initialize all of the games currently. May get called more if we introduce
                // a reset functionality to play more than once.
                this.boundClick = _clickHandler.bind(this);
            }
        },

        activate: {
            value: function activate(activationContext) {
                Game.prototype.activate.call(this, activationContext);

                this.starSprites = [];
                this.rainbowSprites = [];

                this.rootSprite.addChild(new FillSprite(GlobalRuleSet.GameMinX, GlobalRuleSet.GameMinY, GlobalRuleSet.GameWidth, GlobalRuleSet.GameHeight, "darkblue"));
                for (var i = 0; i < 30; i++) {
                    var x = 0.95 * (Math.randomIntInRange(0, GlobalRuleSet.GameWidth) - GlobalRuleSet.GameWidth / 2) + GlobalRuleSet.GameCenterX;
                    var y = 0.95 * (Math.randomIntInRange(0, GlobalRuleSet.GameHeight) - GlobalRuleSet.GameHeight / 2) + GlobalRuleSet.GameCenterY;

                    var starSprite = new AnimatedFrameSprite(x, y, document.getElementById("imgNyanStarSprite"), 50, 6, 15);
                    starSprite.randomizeInitialFrame();
                    this.rootSprite.addChild(starSprite);
                    this.starSprites.push(starSprite);
                }

                this.nyanSprite = new AnimatedFrameSprite(GlobalRuleSet.GameCenterX - 100, GlobalRuleSet.GameCenterY, document.getElementById("imgNyanSprite"), 100, 6, 10);
                this.nyanSprite.frameChangedCallback = _callbackUpdateRainbow.bind(this);

                var rainBowOffset = this.nyanSprite.x - 30;
                while (rainBowOffset > GlobalRuleSet.GameMinX) {
                    var rainbowSprite = new ImageSprite(rainBowOffset, this.nyanSprite.y, document.getElementById("imgNyanRainbowSprite"));
                    this.rootSprite.addChild(rainbowSprite);
                    this.rainbowSprites.push(rainbowSprite);
                    rainBowOffset -= 9;
                }
                
                this.rootSprite.addChild(this.nyanSprite);
            }
        },
        inputActivate: {
            value: function inputActivate(activationContext) {
                Game.prototype.inputActivate.call(this, activationContext);

                activationContext.renderTargetElement.addEventListener("click", this.boundClick);
                this.saveLevel = SoundManager.volumeMusic;
                var newLevel = Math.min(0.2, this.saveLevel);
                SoundManager.volumeMusic = newLevel;
                SoundManager.playMusic("nyan");
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                Game.prototype.deactivate.call(this, activationContext);

                SoundManager.stopAll();
                SoundManager.volumeMusic = this.saveLevel;
                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);
                this.rootSprite.removeAllChildren();
                return true;
            }
        },

        getLeaderboardScore: {
            value: function getLeaderboardScore() {
            }
        }
    });
})();