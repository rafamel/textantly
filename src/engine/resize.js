function getPc(resize) {
    return {
        // eslint-disable-next-line
        width: (resize.width != undefined)
            ? resize.width : 100,
        // eslint-disable-next-line
        height: (resize.height != undefined)
            ? resize.height : 100
    };
}

function getDimensions(dimensions, resize = {}) {
    const pc = getPc(resize);
    return {
        width: Math.round((dimensions.width * pc.width) / 100),
        height: Math.round((dimensions.height * pc.height) / 100)
    };
}

function draw(canvas, resize) {
    if (!resize) return canvas;

    const { width, height } = getDimensions(
        { width: canvas.width, height: canvas.height },
        resize
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
    getPc,
    getDimensions,
    draw
};
