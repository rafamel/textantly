import resize from './resize';
import rotate from './rotate';
import flip from './flip';
import scale from './scale';

function drawEngine(canvas, imageEdits) {
    canvas = resize.draw(canvas, imageEdits.resize);
    canvas = rotate.draw(canvas, imageEdits.rotate);
    canvas = flip.draw(canvas, imageEdits.flip);
    return canvas;
}

function dimensionsEngine(dimensions, imageEdits) {
    dimensions = resize.getDimensions(dimensions, imageEdits.resize);
    dimensions = rotate.getDimensions(dimensions, imageEdits.rotate);
    dimensions = scale.getDimensions(dimensions, imageEdits.scale);
    return dimensions;
}

function draw(canvas, imageEdits, textEdits) {
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
