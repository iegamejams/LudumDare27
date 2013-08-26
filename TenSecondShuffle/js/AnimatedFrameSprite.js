"use strict";

function AnimatedFrameSprite(x, y, image, width, frames, frameRate) {
    this.frames = [];
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameChangedCallback;

    for (var i = 0; i < frames; i++) {
        var frame = {
            image: image,

            sourceX: i * width,
            sourceY: 0,
            sourceWidth: width,
            sourceHeight: image.naturalHeight,

            centerX: width / 2,
            centerY: image.naturalHeight / 2
        };
        this.frames.push(frame);
    }

    FrameSprite.call(this, x, y, this.frames[0]);
}

AnimatedFrameSprite.prototype = Object.create(FrameSprite.prototype);
AnimatedFrameSprite.prototype.constructor = AnimatedFrameSprite;

Object.defineProperties(AnimatedFrameSprite.prototype, {
    update: {
        value: function update() {
            this.currentFrame++;
            var frameIndex = Math.floor(this.currentFrame / this.frameRate) % this.frames.length;
            var frame = this.frames[frameIndex];
            if (this.frameChangedCallback && frame !== this.frame) {
                this.frameChangedCallback(this, frameIndex);
            }
            this.frame = frame;
        }
    },
    randomizeInitialFrame: {
        value: function randomizeInitialFrame() {
            var frameIndex = Math.floor(Math.random() * this.frames.length);
            this.currentFrame = frameIndex * this.frameRate;
            this.frame = this.frames[frameIndex];
        }
    },
});