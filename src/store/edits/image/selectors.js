import PropTypes from 'prop-types';
import { selectorWithType } from '../../utils/withState';
import engine from 'engine';

const selectors = {};
selectors.rotate = selectorWithType({
    propType: PropTypes.number.isRequired,
    select: [
        state => state.edits.image.last
    ],
    result: (lastOp) => {
        return (lastOp && lastOp.is('rotate'))
            ? lastOp.value
            : 0;
    }
});
selectors.flip = selectorWithType({
    propType: PropTypes.bool.isRequired,
    select: [
        state => state.edits.image.last
    ],
    result: (last) => {
        return (last && last.is('flip')) ? last.value : false;
    }
});

selectors.opsDimensions = selectorWithType({
    propType: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }).isRequired,
    select: [
        state => state.canvases.source,
        state => state.edits.image.operations.list
    ],
    result: (source, opsList) => {
        return (!source)
            ? { width: 0, height: 0 }
            : engine.getDimensions(
                { width: source.width, height: source.height },
                opsList
            );
    }
});

const creators = {};
creators.dimensions = (op) => selectorWithType({
    propType: PropTypes.shape({
        max: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired
        }).isRequired,
        value: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    select: [
        state => state.edits.image.last,
        state => selectors.opsDimensions(state)
    ],
    result: (last, dimensions) => {
        if (!last) return { max: dimensions, value: dimensions };
        if (last.is(op)) return { max: dimensions, value: last.value };

        const max = engine.getDimensions(dimensions, [last]);
        return { max, value: max };
    }
});

export default {
    ...selectors,
    creators
};
