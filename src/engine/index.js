import resize from './resize';
import rotate from './rotate';
import flip from './flip';
import scale from './scale';

const opEngines = {resize, rotate, flip, scale};

class Operation {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    is(ofType) {
        return this.type === ofType;
    }
}

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

function draw(canvas, operations = [], nonScaledDimensions) {
    return operations.reduce((newCanvas, op) => {
        if (!op) return newCanvas;
        return opEngines[op.type].draw(newCanvas, op.value, nonScaledDimensions);
    }, canvas);
}

function getDimensions(dimensions = {}, operations = []) {
    if (!dimensions.width || !dimensions.height) {
        return { width: 0, height: 0 };
    }
    return operations.reduce((newDimensions, op) => {
        if (!op) return dimensions;
        return opEngines[op.type].getDimensions(newDimensions, op.value);
    }, dimensions);
}

export { Operation };
export default {
    makeCanvas,
    draw,
    getDimensions
};
