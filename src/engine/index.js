import resize from './resize';
import rotate from './rotate';
import flip from './flip';
import scale from './scale';

const operations = {resize, rotate, flip, scale};

function makeCanvas(canvasOrImage) {
    const canvas = document.createElement('canvas');
    switch (canvasOrImage.nodeName) {
    case 'CANVAS':
        canvas.width = canvasOrImage.width;
        canvas.height = canvasOrImage.height;
        canvas.getContext('2d').drawImage(
            canvasOrImage, 0, 0, canvas.width, canvas.height
        );
        return canvas;
    case 'IMG':
        canvas.width = canvasOrImage.naturalWidth;
        canvas.height = canvasOrImage.naturalHeight;
        canvas.getContext('2d').drawImage(
            canvasOrImage, 0, 0, canvas.width, canvas.height
        );
        return canvas;
    default:
        return canvasOrImage;
    }
}

function draw(canvas, imageEdits = [], textEdits) {
    return imageEdits.reduce((newCanvas, edit) => {
        if (!edit) return newCanvas;
        const op = Object.keys(edit)[0];
        return operations[op].draw(newCanvas, edit[op]);
    }, canvas);
}

function getDimensions(dimensions = {}, imageEdits = []) {
    if (!dimensions.width || !dimensions.height) {
        return { width: 0, height: 0 };
    }
    return imageEdits.reduce((newDimensions, edit) => {
        if (!edit) return dimensions;
        const op = Object.keys(edit)[0];
        return operations[op].getDimensions(newDimensions, edit[op]);
    }, dimensions);
}

export default {
    makeCanvas,
    draw,
    getDimensions
};
