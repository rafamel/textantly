function getDimensions(dimensions, resize) {
    const getDimFromRatio = (dim) => {
        const alpha = 0.025;
        let ratio = resize.ratio;
        if (Math.abs(1 - ratio) <= alpha) ratio = 100;
        if (Math.abs(0 - ratio) <= alpha) ratio = 0;
        return Math.round(dim * ratio);
    };

    if (!resize || resize.ratio === 100) return dimensions;

    let r = { ...resize };
    if (r.width == null || r.height == null) {
        r.width = getDimFromRatio(dimensions.width);
        r.height = getDimFromRatio(dimensions.height);
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
