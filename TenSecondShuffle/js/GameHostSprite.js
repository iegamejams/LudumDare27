"use strict";

function GameHostSprite(activationContext, x, y) {
    Sprite.call(this, x, y);

    this.addNamedChild("mainPivot", new Sprite(GlobalRuleSet.GameHostWidth / 2, GlobalRuleSet.GameHostHeight * 3));
    this.activationContext = activationContext;
    this.reset();
}

GameHostSprite.prototype = Object.create(Sprite.prototype);
GameHostSprite.prototype.constructor = GameHostSprite;

(function initialize_GameHostSprite() {
    function HostState() {
    }
    Object.defineProperties(HostState, {
        INITIAL: { value: 0 },
        GAMESWITCH: { value: 1 },
        COUNTDOWN: { value: 2 },
        MENU: { value: 3 },
        GAMEOVER: { value: 4 },
        GAMERUNNING: { value: 5 },
    });

    Object.defineProperties(GameHostSprite.prototype, {
        GAME_SWITCH_TIME: {
            value: 60 * 10 // 60 fps at 10 seconds
        },

        reset: {
            value: function reset() {
                this.currentGame = -1;
                this.currentFrame = 0;
                this.state = HostState.INITIAL;
            }
        },

        addGame: {
            value: function addGame(gameDescriptor) {
                // Build out the sprite arms
                var gamePivotSprite = new Sprite(0, 0);
                var gameAlignerSprite = new Sprite(-this.mainPivot.x, -this.mainPivot.y);

                // Add them into the tree
                this.mainPivot.addChild(gamePivotSprite);
                gamePivotSprite.addChild(gameAlignerSprite);
                gameAlignerSprite.addChild(gameDescriptor.rootSprite);

                // Setup easy access from the pivot to the game root sprite for activation.
                gamePivotSprite.gameRootSprite = gameDescriptor.rootSprite;

                // Reoffset the wheel based on this new information
                var childCount = this.mainPivot.children.length;
                if (childCount > 1) {
                    this.arcPerGame = Math.PI * 2 / childCount;
                    for (var i = 1; i < childCount; i++) {
                        this.mainPivot.children[i].rotation = -(this.arcPerGame * i);
                    }
                }
            }
        },

        update: {
            value: function update() {
                switch (this.state) {
                    case HostState.INITIAL:
                    case HostState.GAMERUNNING:
                        {
                            this.state = HostState.GAMERUNNING;
                            if (this.currentFrame % GlobalRuleSet.GAME_SWITCH_FRAMES === 0) {
                                var canContinue = true;
                                var canSwitch = false;
                                if (this.currentGame !== -1) {
                                    canContinue = this.mainPivot.children[this.currentGame].gameRootSprite.deactivate(this.activationContext);
                                    canSwitch = true;
                                }

                                if (canContinue) {
                                    this.currentGame = (this.currentGame + 1) % this.mainPivot.children.length;
                                    this.mainPivot.children[this.currentGame].gameRootSprite.activate(this.activationContext);

                                    if (canSwitch) {
                                        this.targetArc = this.mainPivot.rotation + this.arcPerGame;
                                        this.state = HostState.GAMESWITCH;
                                    }
                                }
                                else {
                                    this.state = HostState.GAMEOVER;
                                }
                            }
                            else {
                                this.mainPivot.children[this.currentGame].update();
                            }
                            this.currentFrame++;
                        }
                        break;

                    case HostState.GAMESWITCH:
                        {
                            var currentRotation = Math.min(this.targetArc, this.mainPivot.rotation + (this.arcPerGame / 80));
                            if (this.targetArc == currentRotation) {
                                this.state = HostState.GAMERUNNING;
                            }
                            this.mainPivot.rotation = currentRotation;
                        }
                        break;
                }
            }
        },

        draw: {
            value: function draw(drawingContext) {
                switch (this.state) {
                    case HostState.GAMERUNNING:
                    case HostState.GAMESWITCH:
                        {
                            drawingContext.pushTransform(this);

                            this.drawGameCore(drawingContext);
                            this.drawCore(drawingContext);

                            drawingContext.popTransform();
                        }
                        break;
                }
            }
        },
        drawGameCore: {
            value: function drawGameCore(drawingContext) {
                var mainPivot = this.mainPivot;
                var games = mainPivot.children.length;

                var previousGame = (this.currentGame + games - 1) % games;
                var nextGame = (this.currentGame + 1) % games;

                drawingContext.pushTransform(mainPivot);

                mainPivot.children[previousGame].draw(drawingContext);
                mainPivot.children[this.currentGame].draw(drawingContext);
                mainPivot.children[nextGame].draw(drawingContext);

                drawingContext.popTransform();
            }
        },
        drawCore: {
            value: function drawCore(drawingContext) {
                drawingContext.ctx.strokeStyle = "black";
                drawingContext.ctx.strokeRect(GlobalRuleSet.GameMinX, GlobalRuleSet.GameMinY, GlobalRuleSet.GameWidth, GlobalRuleSet.GameHeight);
            }
        },
    });
})();