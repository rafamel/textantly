import PropTypes from 'prop-types';
import { selectorWithType } from '../utils/withState';

const selectors = {};

// chc
// selectors.isScaledSynced = selectorWithType({
//     propType: PropTypes.bool.isRequired,
//     select: [
//         state => state._loading.rendering,
//         state => state.edits.image.operations.id,
//         state => state.canvases.scaled.forId
//     ],
//     result: (rendering, id, forId) => !rendering && id === forId
// });

selectors.sourceDimensions = selectorWithType({
    propType: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }).isRequired,
    select: [
        state => state.canvases.source.canvas
    ],
    result: (canvas) => (canvas)
        ? { width: canvas.width, height: canvas.height }
        : { width: 0, height: 0 }
});

export default selectors;
