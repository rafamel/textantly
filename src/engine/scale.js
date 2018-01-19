function maxScaled({ width, height }, { maxWidth, maxHeight }) {
    const scaledWidth = Math.ceil(width * (maxHeight / height));
    return (scaledWidth > maxWidth)
        ? {
            width: maxWidth,
            height: Math.ceil(height * (maxWidth / width))
        } : {
            width: scaledWidth,
            height: maxHeight
        };
}

function getDimensions(
    dimensions,
    { width: maxWidth, height: maxHeight } = {}
) {
    if (!maxWidth && !maxHeight) return dimensions;
    if (!maxWidth) maxWidth = dimensions.width;
    if (!maxHeight) maxHeight = dimensions.height;
    if (maxHeight >= dimensions.height && maxWidth >= dimensions.width) {
        return dimensions;
    }
    return maxScaled(dimensions, { maxWidth, maxHeight });
}

function draw(canvas, scale) {
    if (!scale) return canvas;

    const { width, height } = getDimensions(
        { width: canvas.width, height: canvas.height }, scale
    );

    if (width === canvas.width && height === canvas.height) {
        return canvas;
    }

    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;
    const ctx = newCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
        0, 0, newCanvas.width, newCanvas.height);
    return newCanvas;
}

export default {
    getDimensions,
    draw
};
