function getDimFromRatio(dim, ratio) {
    const alpha = 0.025;
    if (Math.abs(1 - ratio) <= alpha) ratio = 100;
    if (Math.abs(0 - ratio) <= alpha) ratio = 0;
    return Math.round(dim * ratio);
};

function getDimensions(dimensions, resize) {
    if (!resize) return dimensions;

    let r = {};
    if (resize.width == null && resize.height == null) {
        r.width = getDimFromRatio(dimensions.width, resize.widthRatio);
        r.height = getDimFromRatio(dimensions.height, resize.heightRatio);
    } else if (resize.width == null) {
        r.width = getDimFromRatio(dimensions.width, resize.widthRatio);
        r.height = resize.height;
    } else if (resize.height == null) {
        r.width = resize.width;
        r.height = getDimFromRatio(dimensions.height, resize.heightRatio);
    } else {
        r = resize;
    }

    return {
        width: Math.min(r.width, dimensions.width),
        height: Math.min(r.height, dimensions.height)
    };
}

function draw(canvas, resize, nonScaledDims) {
    let resized;
    if (nonScaledDims) {
        if (nonScaledDims.width > canvas.width) return canvas;
        resized = nonScaledDims;
    } else {
        resized = getDimensions(
            { width: canvas.width, height: canvas.height },
            resize
        );
    }

    const newCanvas = document.createElement('canvas');
    newCanvas.width = resized.width;
    newCanvas.height = resized.height;
    const ctx = newCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
        0, 0, newCanvas.width, newCanvas.height);
    return newCanvas;
}

export default {
    getDimensions,
    draw
};
