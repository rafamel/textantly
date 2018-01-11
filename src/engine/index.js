import rotate from './rotate';
import flip from './flip';

function editsEngine(canvas, imageEdits) {
    canvas = flip(canvas, imageEdits.flip);
    canvas = rotate(canvas, imageEdits.rotate);
    return canvas;
}

export default function engine(canvasOrImage, { imageEdits, textEdits } = {}) {
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

    if (imageEdits) canvas = editsEngine(canvas, imageEdits);
    return canvas;
};
