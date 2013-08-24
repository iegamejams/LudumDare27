"use strict";

function ImageSprite(x, y, image) {
    var frame = {
        image: image,

        sourceX: 0,
        sourceY: 0,
        sourceWidth: image.naturalWidth,
        sourceHeight: image.naturalHeight,

        centerX: image.naturalWidth / 2,
        centerY: image.naturalHeight / 2
    };
    FrameSprite.call(this, x, y, frame);
}

// Should be FrameSprite.prototype when written
ImageSprite.prototype = Object.create(FrameSprite.prototype);
ImageSprite.prototype.constructor = ImageSprite;

Object.defineProperties(ImageSprite.prototype, {
});