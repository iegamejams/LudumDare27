"use strict";

function GameHostSprite(activationContext, x, y) {
    Sprite.call(this, x, y);

    // Set up the game host's main UI components
    this.addNamedChild("mainPivot", new Sprite(GlobalRuleSet.GameHostWidth / 2, GlobalRuleSet.GameHostHeight * 3));
    this.addNamedChild("clockPivot", new Sprite(this.mainPivot.x, this.mainPivot.y));
    this.addNamedChild("countdownTimer", new OverlaySprite("rgba(0, 0, 0, 0.8)"));

    // Create the holder for the Game Over sign
    this.addNamedChild("gameOver", new OverlaySprite("rgba(0, 0, 0, 0.8)"));

    // Set up the countdown timer components
    this.countdownTimer.addChild(new FillSprite(GlobalRuleSet.GameCenterX - 50, GlobalRuleSet.GameCenterY - 20, 100, 50, "beige"));
    this.countdownTimer.addNamedChild("timer", new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, "", "bold 18pt Calibri"));

    // Set up the clock's image sprite.
    this.clockPivot.addNamedChild("clockArm", new ImageSprite(0, -GlobalRuleSet.GameHostHeight * 2.25, document.getElementById("imgClockHand")));
    this.clockPivot.ticks = -1;

    // Set up the Game Over sign
    this.gameOver.addChild(new FillSprite(GlobalRuleSet.GameCenterX - 150, GlobalRuleSet.GameCenterY - 20, 300, 50, "beige"));
    this.gameOver.addChild(new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, "Game Over :-(", "bold 18pt Calibri"));

    this.gameOver.addChild(new FillSprite(GlobalRuleSet.GameCenterX - 150, GlobalRuleSet.GameCenterY + 40, 300, 50, "beige"));
    this.gameOver.addChild(new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY + 60, "Click to Restart...", "italic bold 14pt Calibri"));

    this.gameOver.addChild(new FillSprite(GlobalRuleSet.GameCenterX - 150, GlobalRuleSet.GameCenterY + 80, 300, 50, "beige"));
    this.gameOver.addNamedChild("level", new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY + 100, "", "bold 14pt Calibri"));
    this.gameOver.level.alignment = "left";

    this.gameOver.addChild(new FillSprite(GlobalRuleSet.GameCenterX - 150, GlobalRuleSet.GameCenterY + 120, 300, 50, "beige"));
    this.gameOver.addNamedChild("score", new TextSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY + 140, "", "bold 14pt Calibri"));
    this.gameOver.score.alignment = "left";

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

                gamePivotSprite.isSkipCountdown =
                    ((typeof gameDescriptor.isSkipCountdown === "boolean") ? gameDescriptor.isSkipCountdown : false);

                gamePivotSprite.addChild(gameAlignerSprite);
                gameAlignerSprite.addChild(gameDescriptor.rootSprite);

                // Setup easy access from the pivot to the game root sprite for activation.
                gamePivotSprite.gameRootSprite = gameDescriptor.rootSprite;
                gamePivotSprite.rotation = Math.PI;
            }
        },

        update: {
            value: function update() {
                switch (this.state) {
                    case HostState.INITIAL:
                    case HostState.GAMERUNNING:
                        {
                            if (this.state === HostState.GAMERUNNING) {
                                if (this.currentFrame % GlobalRuleSet.GAME_SWITCH_FRAMES_PER_SECOND === 0) {
                                    this.clockPivot.ticks++;
                                    if (this.clockPivot.ticks % 2 == 0) {
                                        SoundManager.play("tick");
                                    }
                                    else {
                                        SoundManager.play("tock");
                                    }
                                    this.clockPivot.rotation += GlobalRuleSet.ClockRotation;
                                }
                            }
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
                                        this.mainPivot.children[this.currentGame].rotation = 0;
                                        if (!this.mainPivot.children[this.currentGame].isSkipCountdown)
                                            this.transitionTo(HostState.COUNTDOWN);
                                        else
                                            this.transitionTo(HostState.GAMERUNNING);
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
                            var currentRotation = Math.max(this.targetArc, this.mainPivot.rotation - GlobalRuleSet.ClockRotation * .1);
                            if (this.targetArc == currentRotation) {
                                if (!this.mainPivot.children[this.currentGame].isSkipCountdown)
                                    this.transitionTo(HostState.COUNTDOWN);
                                else
                                    this.transitionTo(HostState.GAMERUNNING);
                            }
                            this.clockPivot.rotation -= GlobalRuleSet.ClockRotation * .1;
                            this.mainPivot.rotation = currentRotation;
                        }
                        break;

                    case HostState.COUNTDOWN:
                        {
                            var countdownTime = 3 - Math.floor((new Date() - this.startCountdownTimer) / 1000);
                            if (countdownTime <= 0) {
                                this.transitionTo(HostState.GAMERUNNING);
                            }
                            else if (this.countdownTime !== countdownTime) {
                                if (countdownTime === 2) {
                                    SoundManager.play("set");
                                }
                                if (countdownTime === 1) {
                                    SoundManager.play("go");
                                }
                                this.countdownTime = countdownTime;
                                this.countdownTimer.timer.changeText(countdownTime + "...");
                            }
                        }
                        break;
                    case HostState.GAMEOVER:
                        {
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
                            this.clockPivot.rotation = -(GlobalRuleSet.ClockRotation * 5);

                            var nextGame = (this.currentGame + 1) % this.mainPivot.children.length;
                            this.mainPivot.children[nextGame].rotation = -(this.mainPivot.rotation - GlobalRuleSet.ClockRotation * 10);

                            SoundManager.play("ready");
                        }
                        break;
                    case HostState.GAMERUNNING:
                        {
                            this.mainPivot.children[this.currentGame].gameRootSprite.inputActivate(this.activationContext);
                            this.startClockFrames = this.currentFrame;
                        }
                        break;
                    case HostState.GAMESWITCH:
                        {
                            this.targetArc = this.mainPivot.rotation - (GlobalRuleSet.ClockRotation * 10);
                            this.mainPivot.children[this.currentGame].rotation = -this.targetArc;
                            
                            var nextGame = (this.currentGame + 1) % this.mainPivot.children.length;
                            this.mainPivot.children[nextGame].rotation = -(this.targetArc - GlobalRuleSet.ClockRotation * 10);
                        }
                        break;
                    case HostState.GAMEOVER:
                        {
                            window.addEventListener("click", function () { window.location.reload(); });
                            var games = this.mainPivot.children;
                            var totalScore = 0;
                            var highestLevel = 0;

                            for (var i = 0; i < games.length; i++) {
                                var gameObject = games[i].gameRootSprite.gameObject;
                                totalScore += gameObject.score;
                                highestLevel = Math.max(highestLevel, gameObject.level);
                            }

                            this.gameOver.level.changeText("Level: " + highestLevel);
                            this.gameOver.score.changeText("Score: " + totalScore);
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

                            this.clockPivot.draw(drawingContext);
                            this.drawGameCore(drawingContext);

                            if (this.state === HostState.COUNTDOWN) {
                                this.drawCountdownTimer(drawingContext);
                            }

                            drawingContext.popTransform();
                        }
                        break;
                    case HostState.GAMEOVER:
                        {
                            this.gameOver.draw(drawingContext);
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
    });
})();