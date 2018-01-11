import isEqual from 'lodash.isequal';
import rotate from './rotate';
import flip from './flip';

function drawEdits(canvas, edits) {
    canvas = rotate(canvas, edits.rotate);
    canvas = flip(canvas, edits.flip);
    return canvas;
}

const state = {
    src: null,
    image: null,
    drawnFor: null
};

export default function drawCanvas({ image, force, props } = {}) {
    if (!props) props = this.props;
    if (!image) image = state.image;
    else state.image = image;

    const rootNode = this.rootNode;
    if (!rootNode || !image) return;

    const activeViews = props.activeViews;
    const imageEdits = (!activeViews.main || activeViews.main !== 'image')
        ? props.imageEdits
        : {
            ...props.imageEdits,
            [activeViews.image]: undefined
        };

    if (
        !force
        && state.drawnFor
        && isEqual(imageEdits, state.drawnFor)
    ) {
        return;
    }

    let canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(
        image, 0, 0, canvas.width, canvas.height
    );
    canvas = drawEdits(canvas, imageEdits);

    rootNode.prepend(canvas);
    if (rootNode.children[1]) rootNode.children[1].remove();
    state.drawnFor = imageEdits;
};
