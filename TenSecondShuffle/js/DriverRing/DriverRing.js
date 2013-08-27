"use strict";

function DriverRing(gameRootSprite) {
    Game.call(this, gameRootSprite);
}

DriverRing.prototype = Object.create(Game.prototype);
DriverRing.prototype.constructor = DriverRing;

(function initialization_DriverRing() {
    var _clickHandler = function click(evt) {

        var mouseX = evt.offsetX, mouseY = evt.offsetY;
        
        if (isInView(mouseX, mouseY, 20)) {
            this.v2Target[0] = mouseX;
            this.v2Target[1] = mouseY;

            // Acceleration.
            this.accel += this.accelStep;

            // Direction.
            var mX = mouseX,
                mY = mouseY;

            this.v2Dir[0] = mX - this.rootSprite.carSprite.x;
            this.v2Dir[1] = mY - this.rootSprite.carSprite.y;

            this.rot = Math.atan2(this.v2Dir[1], this.v2Dir[0]);

            this.isTargetReached = false;
        }
    }

    Object.defineProperties(DriverRing.prototype, {
        showWinOverlay: {
            value: true
        },
        update: {
            value: function update() {

                if (this.cntGreens == this.rings.length) {
                    this.earlyWin = true;
                    return;
                }

                if (Math.distance2d(this.v2Target[0], this.v2Target[1],
                                    this.rootSprite.carSprite.x, this.rootSprite.carSprite.y) < this.rootSprite.carSprite.scl * 2)
                    this.isTargetReached = true;

                if(this.isTargetReached)
                    this.accel -= this.accelStep * 1.8;

                this.vel += this.accel;

                if (this.vel >= this.velMax) this.vel = this.velMax;
                else if (this.vel <= 0) this.vel = 0;

                if (this.accel >= this.accelMax) this.accel = this.accelMax;
                else if (this.accel <= 0) this.accel = 0;

                this.rotCur += (this.rot - this.rotCur) * .5;

                this.v2Dir[0] = Math.cos(this.rotCur);
                this.v2Dir[1] = Math.sin(this.rotCur);

                this.rootSprite.carSprite.x += this.vel * this.v2Dir[0]
                this.rootSprite.carSprite.y += this.vel * this.v2Dir[1];

                this.rootSprite.carSprite.setRotation(this.rotCur + Math.PI * .5);

                // Make Rings Green.
                this.cntGreens = 0;
                for (var i = 0; i < this.rings.length; ++i) {

                    if (this.rings[i].sprite.stroke !== "green") {
                        if (Math.distance2d(this.rings[i].x, this.rings[i].y,
                                        this.rootSprite.carSprite.x, this.rootSprite.carSprite.y) < this.rootSprite.carSprite.scl * 2)
                            this.rings[i].sprite.stroke = "green";
                    } else
                        this.cntGreens++;
                }
            }
        },

        init: {
            value: function init(gameDescriptor) {
                Game.prototype.init.call(this, gameDescriptor);
                this.sclCar = 20;

                this.boundClick = _clickHandler.bind(this);

                this.accelStep = .2;
                this.accelMax = 5;
                this.velMax = 5;
            }
        },

        activate: {
            value: function activate(activationContext) {
                this.level++;

                this.isTargetReached = false;

                // Initialize
                this.rot = 0;
                this.rotCur = 0;

                // Car Physics
                this.v2Target = [0, 0];
                this.v2DirCur = [0, 0]
                this.v2Dir = [0, 0];
                this.v2Pos = [0, 0];

                this.vel = 0;
                this.accel = 0;

                // Rings
                this.rings = [];
                this.cntGreens = 0;

                // Add rings.
                this.radius = this.level * 40;
                var diameter = this.radius * 2;
                this.diameter = diameter;

                for (var i = 0; i < this.level * 3; ++i) {
                    var angle = (i / this.level) * Math.PI;
                    var x = GlobalRuleSet.GameCenterX + (Math.cos(angle) * GlobalRuleSet.GameWidth * .25) - this.radius,
                        y = GlobalRuleSet.GameCenterY + (Math.sin(angle) * GlobalRuleSet.GameHeight * .25) - this.radius;

                    var targetSprite = new DashedCircleSprite(x, y, this.radius);
                    targetSprite.fill = "transparent";
                    targetSprite.stroke = "red";
                    this.rootSprite.addNamedChild("targetSprite" + i, targetSprite);

                    this.rings.push({ x: x, y: y, sprite: targetSprite });
                }

                // Add Car sprite
                var carSprite = new CarSprite(GlobalRuleSet.GameCenterX, GlobalRuleSet.GameCenterY, this.sclCar);
                this.rootSprite.addNamedChild("carSprite", carSprite);
            }
        },
        inputActivate: {
            value: function inputActivate(activationContext) {
                this.v2Pos = [this.rootSprite.carSprite.x, this.rootSprite.carSprite.y];
                activationContext.renderTargetElement.addEventListener("click", this.boundClick);
            }
        },
        deactivate: {
            value: function deactivate(activationContext) {
                activationContext.renderTargetElement.removeEventListener("click", this.boundClick);

                // Determine if the player won or lost
                var canContinue = false;
                if (this.cntGreens == this.rings.length) {
                    canContinue = true;
                }

                this.rings = [];

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