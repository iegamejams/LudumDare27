"use strict";

function ClaySprite(x, y) {
    Sprite.call(this, x, y);
    var ctx = drawingContext.ctx;

    var grd = ctx.createLinearGradient(0, 0, 100, 100);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    this.fill = grd;

    this.stroke = "black";
    this.lineWidth = 1;

    this.points = [];
    this.targetPoints = [];

    this.scl = 80;

    this.interp = .1;
    this.influenceDistance = 40;

    this.minX = 0, this.maxX = 0,
    this.minY = 0, this.maxY = 0;
}

ClaySprite.prototype = Object.create(Sprite.prototype);
ClaySprite.prototype.constructor = ClaySprite;

Object.defineProperties(ClaySprite.prototype, {
    drawCore: {
        value: function drawCore(drawingContext) {

            var ctx = drawingContext.ctx;

            // Draw Central bar and base.
            ctx.beginPath();
            ctx.moveTo(0, this.points[0].y - 50);
            ctx.lineTo(0, this.points[this.points.length - 1].y + 50);
            ctx.moveTo(-100, this.points[this.points.length - 1].y + 50);
            ctx.lineTo(100, this.points[this.points.length - 1].y + 50);
            ctx.stroke();

            // Draw Clay.
            this.drawSprite(this.points, this.fill);

            // Draw Target Shape.
            this.drawSprite(this.targetPoints, null, "red");
        }
    },
    drawSprite: {
        value: function drawSprite(points, fill, stroke) {
            var ctx = drawingContext.ctx;
            // Draw Clay section
            ctx.beginPath();

            ctx.moveTo(-points[0].x, points[0].y);
            ctx.lineTo(points[0].x, points[0].y);

            for (var i = 0; i < this.points.length; ++i) {
                if(points[i].targetX)
                    points[i].x += (points[i].targetX - points[i].x) * this.interp + Math.random() * 2;
                ctx.lineTo(points[i].x, points[i].y);
            }
            // Left side of the clay mold.
            for (var i = points.length - 1; i > -1; --i) {
                if (points[i].targetX)
                    points[i].x += (points[i].targetX - points[i].x) * this.interp + Math.random() * 2;
                ctx.lineTo(-points[i].x, points[i].y);
            }
            
            // Draw
            if(fill) {
                ctx.fillStyle = fill;
                ctx.fill();
            }

            if (typeof stroke === 'undefined')
                stroke = 'solid';

            if (stroke) {
                ctx.strokeStyle = stroke;
                ctx.stroke();
            }
        }
    }
    ,
    addSymmetricalPoint: {
        value: function addSymmetricalPoint(x, y) {
            x *= this.scl; y *= this.scl;

            // Get Clay slab extremes.
            if (x > this.maxX)
                this.maxX = x;
            else if (x < this.minX)
                this.minX = x;

            if (y > this.maxY)
                this.maxY = y;
            else if (y < this.minY)
                this.minY = y;

            this.points.push({
                x: x, y: y,
                targetX: x, targetY: y
            });
        }
    },
    updateTouch: {
        value: function updateTouch(x, y) {
            var mx = GlobalRuleSet.GameCenterX - x,
                my = GlobalRuleSet.GameCenterY - y;

            var scl = this.scl,
                distToCenterX = 0, distToCenterY = 0, distToCenter = 0,
                distToPointX = 0, distToPointY = 0, distToPoint = 0,
                posX = 0, posY = 0;

            for (var i = 0; i < this.points.length; ++i) {
                posX = this.points[i].x;
                posY = this.points[i].y;

                distToCenterX = Math.abs(GlobalRuleSet.GameCenterX - x);
                distToCenterY = Math.abs(GlobalRuleSet.GameCenterY - y);
                distToCenter = Math.sqrt(distToCenterX * distToCenterX + distToCenterY * distToCenterY);

                distToPointX = Math.abs(posX - distToCenterX);
                distToPointY = Math.abs(posY - distToCenterY);
                distToPoint = Math.sqrt(distToPointX * distToPointX + distToPointY * distToPointY);

                if(distToPointY < this.influenceDistance &&
                   distToPointX < this.influenceDistance )
                    if (distToCenterX < posX)
                        this.points[i].targetX += (distToPoint * .3);
                    else if (distToCenterX < posX * 1.4)
                        this.points[i].targetX -= (distToPoint * .3);
            }
        }
    },
    generateTargetShape: {
        value: function generateTargetShape() {
            // Todo: Go through all the points and create the mold.

            for (var i = 0; i < this.points.length; ++i) {
                this.targetPoints.push({
                    x: Math.random() * this.points[i].x + this.points[i].x * .5,
                    y: this.points[i].y + Math.random() * 5
                });
            }
        }
    },
    MatchPercentageToTarget: {
        value: function MatchPercentageToTarget() {
            return true;
        }
    }
});
