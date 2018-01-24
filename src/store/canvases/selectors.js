import PropTypes from 'prop-types';
import { selectorWithType } from '../utils/withState';

const selectors = {};
selectors.drawnDimensions = selectorWithType({
    propType: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    select: state => state.canvases.drawn.canvas,
    result: drawn => (!drawn)
        ? { width: 0, height: 0 }
        : { width: drawn.width, height: drawn.height }
});

selectors.isScaledSynced = selectorWithType({
    propType: PropTypes.bool.isRequired,
    select: [
        state => state._loading.rendering,
        state => state.edits.image.operations.id,
        state => state.canvases.scaled.forId
    ],
    result: (rendering, id, forId) => !rendering && id === forId
});

export default selectors;
