function getDimensions(dimensions, crop) {
    return {
        width: Math.round(
            dimensions.width * (crop.width.end - crop.width.start)
        ),
        height: Math.round(
            dimensions.height * (crop.height.end - crop.height.start)
        )
    };
}

function draw(canvas, crop) {
    const x = canvas.width * crop.width.start;
    const y = canvas.height * crop.height.start;
    const dimensions = getDimensions(
        { width: canvas.width, height: canvas.height }, crop
    );

    const newCanvas = document.createElement('canvas');
    newCanvas.width = dimensions.width;
    newCanvas.height = dimensions.height;
    const ctx = newCanvas.getContext('2d');
    ctx.drawImage(canvas, x, y, dimensions.width, dimensions.height,
        0, 0, dimensions.width, dimensions.height);
    return newCanvas;
}

export default {
    getDimensions,
    draw
};
