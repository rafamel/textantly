import PropTypes from 'prop-types';
import { selectorWithType } from '../utils/withState';
import engine from 'engine';

const selectors = {};
selectors.maxDrawn = selectorWithType({
    propType: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    select: state => state.canvases.drawn,
    result: drawn => (!drawn)
        ? { width: 0, height: 0 }
        : { width: drawn.width, height: drawn.height }
});

selectors.maxLast = selectorWithType({
    propType: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    select: [
        state => selectors.maxDrawn(state),
        state => state.edits.image.last,
        (_, exclude) => exclude
    ],
    result: (drawnDimensions, lastOp, exclude) => {
        return (!lastOp
            || (exclude && Object.keys(lastOp).includes(exclude)))
            ? drawnDimensions
            : engine.getDimensions(drawnDimensions, [lastOp]);
    }
});

selectors.lastScaled = selectorWithType({
    propType: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    select: [
        state => selectors.maxLast(state),
        state => state.views.dimensions
    ],
    result: (lastDimensions, dimensions) => {
        return engine.getDimensions(lastDimensions, [{ scale: dimensions }]);
    }
});

export default selectors;
