"use strict";

function GameHostSprite(activationContext, x, y) {
    Sprite.call(this, x, y);

    this.addNamedChild("mainPivot", new Sprite(GlobalRuleSet.GameHostWidth / 2, GlobalRuleSet.GameHostHeight * 3));
    this.addNamedChild("countdownTimer", new OverlaySprite("rgba(0, 0, 0, 0.2)"));
    this.countdownTimer.addNamedChild("timer", new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, "", "bold 18pt Calibri"));
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
                                        this.transitionTo(HostState.GAMESWITCH);
                                    }
                                    else {
                                        this.transitionTo(HostState.COUNTDOWN);
                                    }
                                }
                                else {
                                    this.transitionTo(HostState.GAMEOVER);
                                }
                            }
                            else {
                                console.assert(this.state === HostState.GAMERUNNING, "Invalid host state calling update on main game.");
                                this.mainPivot.children[this.currentGame].update();
                            }
                            this.currentFrame++;
                        }
                        break;

                    case HostState.GAMESWITCH:
                        {
                            var currentRotation = Math.min(this.targetArc, this.mainPivot.rotation + (this.arcPerGame / 80));
                            if (this.targetArc == currentRotation) {
                                this.transitionTo(HostState.COUNTDOWN);
                            }
                            this.mainPivot.rotation = currentRotation;
                        }
                        break;

                    case HostState.COUNTDOWN:
                        {
                            var countdownTime = 3 - Math.floor((new Date() - this.startCountdownTimer) / 1000);
                            if (countdownTime <= 0) {
                                this.transitionTo(HostState.GAMERUNNING);
                            }
                            else {
                                this.countdownTimer.timer.changeText(countdownTime + "...");
                            }
                        }
                        break;
                }
            }
        },
        transitionTo: {
            value: function transitionTo(newState) {
                switch (newState) {
                    case HostState.COUNTDOWN:
                        {
                            this.startCountdownTimer = new Date();
                        }
                        break;
                    case HostState.GAMERUNNING:
                        {
                            this.mainPivot.children[this.currentGame].gameRootSprite.inputActivate(this.activationContext);
                        }
                        break;
                    case HostState.GAMESWITCH:
                        {
                            this.targetArc = this.mainPivot.rotation + this.arcPerGame;
                        }
                        break;
                }
                this.state = newState;
            }
        },
        draw: {
            value: function draw(drawingContext) {
                switch (this.state) {
                    case HostState.GAMERUNNING:
                    case HostState.GAMESWITCH:
                    case HostState.COUNTDOWN:
                        {
                            drawingContext.pushTransform(this);

                            this.drawGameCore(drawingContext);
                            this.drawCore(drawingContext);

                            if (this.state === HostState.COUNTDOWN) {
                                this.drawCountdownTimer(drawingContext);
                            }

                            drawingContext.popTransform();
                        }
                        break;
                }
            }
        },
        drawCountdownTimer: {
            value: function drawCountdownTimer(drawingContext) {
                this.countdownTimer.draw(drawingContext);
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