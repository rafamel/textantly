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
    return canvas;
}

export default {
    getDimensions,
    draw
};
