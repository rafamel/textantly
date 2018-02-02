import { maxScaled } from 'engine/fit';

function cropForRatio(dimensions, crop) {
    const length = {
        width: crop.width.end - crop.width.start,
        height: crop.height.end - crop.height.start
    };
    const cropped = {
        width: Math.round(dimensions.width * length.width),
        height: Math.round(dimensions.height * length.height)
    };

    if (!crop.ratio) return { dimensions: cropped, crop };

    const scaled = maxScaled(
        { width: 100 * crop.ratio, height: 100 },
        { maxWidth: cropped.width, maxHeight: cropped.height }
    );

    const difference = {
        width: length.width - (scaled.width / dimensions.width),
        height: length.height - (scaled.height / dimensions.height)
    };

    return {
        dimensions: scaled,
        crop: {
            ratio: crop.ratio,
            width: {
                start: crop.width.start + (difference.width / 2),
                end: crop.width.end - (difference.width / 2)
            },
            height: {
                start: crop.height.start + (difference.height / 2),
                end: crop.height.end + (difference.height / 2)
            }
        }
    };
}

function getDimensions(dimensions, crop) {
    return cropForRatio(dimensions, crop).dimensions;
}

function draw(canvas, crop) {
    const { dimensions, crop: finalCrop } = cropForRatio(
        { width: canvas.width, height: canvas.height }, crop
    );
    const x = canvas.width * finalCrop.width.start;
    const y = canvas.height * finalCrop.height.start;

    const newCanvas = document.createElement('canvas');
    newCanvas.width = dimensions.width;
    newCanvas.height = dimensions.height;
    const ctx = newCanvas.getContext('2d');
    ctx.drawImage(canvas, x, y, dimensions.width, dimensions.height,
        0, 0, dimensions.width, dimensions.height);
    return newCanvas;
}

export { cropForRatio };
export default {
    getDimensions,
    draw
};
