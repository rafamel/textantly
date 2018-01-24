function getDimensions(dimensions, resize = {}) {
    return {
        width: (resize.width || resize.width === 0)
            ? resize.width : dimensions.width,
        height: (resize.height || resize.height === 0)
            ? resize.height : dimensions.height
    };
}

function draw(canvas, resize, nonScaledDimensions) {
    if (
        !resize
        || (resize.width === canvas.width && resize.height === canvas.height)
    ) {
        return canvas;
    }

    let resized = getDimensions(
        { width: canvas.width, height: canvas.height }, resize
    );

    if (nonScaledDimensions
        && nonScaledDimensions.width !== canvas.width
        && nonScaledDimensions.height !== canvas.height) {
        const real = getDimensions(nonScaledDimensions, resize);
        if (real.width < canvas.width || real.height < canvas.height) {
            resized = real;
        } else if (resize.width !== resize.height) {
            resized = (resize.width > resize.height)
                ? {
                    width: canvas.width,
                    height: canvas.height * (resize.height / resize.width)
                } : {
                    height: canvas.height,
                    width: canvas.width * (resize.width / resize.height)
                };
        } else {
            return canvas;
        }
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
