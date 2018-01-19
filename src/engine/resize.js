function getPc({ width: widthPc, height: heightPc }) {
    return {
        // eslint-disable-next-line
        width: Math.min(100, (widthPc != undefined) ? widthPc : 100),
        // eslint-disable-next-line
        height: Math.min(100, (heightPc != undefined) ? heightPc : 100)
    };
}

function getDimensions(dimensions, resize = {}) {
    const pc = getPc(resize);
    return {
        width: Math.ceil((dimensions.width * pc.width) / 100),
        height: Math.ceil((dimensions.height * pc.height) / 100)
    };
}

function draw(canvas, resize, nonScaledDimensions) {
    if (!resize || (resize.width === 100 && resize.height === 100)) {
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
    getPc,
    getDimensions,
    draw
};
