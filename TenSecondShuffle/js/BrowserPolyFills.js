"use strict";

if (typeof window.requestAnimationFrame !== "function") {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    if (typeof window.requestAnimationFrame !== "function") {
        window.requestAnimationFrame = window.mozRequestAnimationFrame;
        if (typeof window.requestAnimationFrame !== "function") {
            window.requestAnimationFrame = function (callback) {
                window.setTimeout(callback, 16);
            }
        }
    }
}

if (!window.console) {
    window.console = {};
    if (!window.console.log) {
        window.console.log = function log(message) {
        }
    }

    if (!window.console.assert) {
        window.console.assert = function assert(condition, message) {
            if (!condition) {
                window.console.log(message);
            }
        }
    }
}