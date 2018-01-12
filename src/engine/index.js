import rotate from './rotate';
import flip from './flip';

function drawEngine(canvas, imageEdits) {
    canvas = flip.draw(canvas, imageEdits.flip);
    canvas = rotate.draw(canvas, imageEdits.rotate);
    return canvas;
}

function dimensionsEngine(dimensions, imageEdits) {
    dimensions = rotate.getDimensions(dimensions, imageEdits.rotate);
    return dimensions;
}

function draw(canvasOrImage, { imageEdits, textEdits } = {}) {
    let canvas;
    switch (canvasOrImage.nodeName) {
    case 'CANVAS':
        canvas = canvasOrImage;
        break;
    case 'IMG':
        canvas = document.createElement('canvas');
        canvas.width = canvasOrImage.naturalWidth;
        canvas.height = canvasOrImage.naturalHeight;
        canvas.getContext('2d').drawImage(
            canvasOrImage, 0, 0, canvas.width, canvas.height
        );
        break;
    default:
        return canvasOrImage;
    }

    if (imageEdits) canvas = drawEngine(canvas, imageEdits);
    return canvas;
}

function getDimensions(dimensions = {}, imageEdits) {
    if (!dimensions.width || !dimensions.height || !imageEdits) {
        return { width: 0, height: 0 };
    }
    return dimensionsEngine(dimensions, imageEdits);
}

export default {
    draw,
    getDimensions
};
