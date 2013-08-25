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
    }
});