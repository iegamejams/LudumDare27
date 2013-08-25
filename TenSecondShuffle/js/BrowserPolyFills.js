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