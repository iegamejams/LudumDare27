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
    this.influenceDistance = this.scl * .6;

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
            this.drawSprite(this.points, this.fill, "solid", true);

            // Draw Target Shape.
            this.drawSprite(this.targetPoints, null, (this.getAverageDistToTarget() < 5? "green" : "red"));
        }
    },
    drawSprite: {
        value: function drawSprite(points, fill, stroke, areControlPointsDisplayed) {
            if ((typeof areControlPointsDisplayed === 'undefined'))
                areControlPointsDisplayed = false;
            var ctx = drawingContext.ctx;
            // Draw Clay section
            ctx.beginPath();

            ctx.moveTo(-points[0].x, points[0].y);
            ctx.lineTo(points[0].x, points[0].y);

            for (var i = 0; i < points.length; ++i) {
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

            if (areControlPointsDisplayed) {
                ctx.strokeStyle = "rgba(0, 150, 220, 0.1)";
                ctx.fillStyle = "rgba(220, 0, 220, 0.1)";
                for (var i = 0; i < points.length; ++i) {
                    ctx.beginPath();
                    ctx.arc(points[i].x, points[i].y, this.influenceDistance * .4, 0, 2 * Math.PI, false);
                    ctx.stroke();
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(-points[points.length - i - 1].x, points[points.length - i - 1].y, this.influenceDistance * .4, 0, 2 * Math.PI, false);
                    ctx.stroke();
                    ctx.fill();

                }
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
            var distToCenterX = 0, distToCenterY = 0, distToCenter = 0,
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
                   (distToPointX < this.influenceDistance || 
                    this.isInSprite(x,y) ))
                    if (distToCenterX < posX)
                        this.points[i].targetX += (distToPoint * .4);
                    else if (distToCenterX < posX * 1.4)
                        this.points[i].targetX -= (distToPoint * .4);
            }
        }
    },
    generateTargetShape: {
        value: function generateTargetShape() {
            for (var i = 0; i < this.points.length; ++i) {
                this.targetPoints.push({
                    x: Math.random() * this.points[i].x + this.points[i].x * .5,
                    y: this.points[i].y
                });
            }
        }
    },
    getAverageDistToTarget: {
        value: function getAverageDistToTarget() {
            var distX = 0, distY = 0, dist = 0, distSum = 0;

            for (var i = 0; i < this.points.length; ++i) {
                distX = this.points[i].x - this.targetPoints[i].x;
                distY = this.points[i].y - this.targetPoints[i].y;
                dist = Math.sqrt(distX * distX + distY * distY);
                distSum += dist;
            }
            return (distSum / this.points.length);
        }
    },
    isInSprite: {
        value: function isInSprite(x, y) {
            var mx = GlobalRuleSet.GameCenterX - x,
                my = GlobalRuleSet.GameCenterY - y;

            return (mx > -this.maxX && mx < this.maxX &&
                    my > -this.maxY && my < this.maxY);
        }
    }
});
