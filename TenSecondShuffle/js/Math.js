"use strict";

Object.defineProperties(Math, {
    randomFloatInRange: {
        value: function randomFloatInRange(min, max) {
            return (Math.random() * (max - min)) + min;
        }
    },
    randomIntInRange: {
        value: function randomIntInRange(min, max) {
            return Math.floor((Math.random() * (max - min + 1)) + min);
        }
    },
    randomIntIndex: {
        value: function randomIntIndex(length) {
            return Math.floor(Math.random() * length);
        }
    },
    distance2d: {
        value: function distance2d(x1, y1, x2, y2) {
            var xDist = x2 - x1;
            var yDist = y2 - y1;
            return Math.sqrt(xDist * xDist + yDist * yDist);
        }
    }
});