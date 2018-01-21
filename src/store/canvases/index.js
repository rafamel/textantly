import PropTypes from 'prop-types';
import typesActions from '../utils/types-actions';
import { createLogic } from 'redux-logic';
import isEqual from 'lodash.isequal';
import engine from 'engine';
import selectors from './selectors';
import loading from '../loading';

const typesPre = 'CANVASES';
const { types: t, actions } = typesActions({
    pre: `${typesPre}_PUBLIC`,
    types: ['SET_SOURCE', 'DRAW', 'SCALE', 'LAST_EXCLUDE']
});

const initialState = {
    source: null,
    drawn: null,
    scaled: {
        id: -1,
        canvas: null
    }
};

const propTypes = {
    source: PropTypes.object,
    drawn: PropTypes.object,
    scaled: {
        id: PropTypes.number,
        canvas: PropTypes.object
    }
};

let internal = {};
internal.TPRIVATE = `${typesPre}_PRIVATE`;
internal.action = (payload) => ({ type: internal.TPRIVATE, payload });

function reducer(state = initialState, { type, payload }) {
    return (type === internal.TPRIVATE) ? { ...state, ...payload } : state;
}

let _drawnFor = null;
const logic = [];
logic.push(createLogic({
    type: t.SET_SOURCE,
    cancelType: t.SET_SOURCE,
    process({ getState, action }, dispatch, done) {
        console.log('setsource');
        dispatch(internal.action({ source: action.payload }));
        dispatch(actions.draw({ force: true }));
        done();
    }
}));

logic.push(createLogic({
    type: t.DRAW,
    cancelType: [t.SET_SOURCE, t.DRAW],
    process({ getState, action }, dispatch, done) {
        const state = getState();
        const canvases = state.canvases;
        const force = (action.payload) ? action.payload.force : false;
        if (!canvases.source) return done();
        console.log('draw');

        const runFor = () => {
            const operations = state.edits.image.operations;
            if (!canvases.drawn
                || (action.payload && action.payload.force)
                || operations.length < _drawnFor.length) {
                return [canvases.source, operations];
            }
            for (let i = 0; i < _drawnFor.length; i++) {
                if (!isEqual(_drawnFor[i], operations[i])) {
                    return [canvases.source, operations];
                }
            }
            console.log('drawn only for last');
            return [
                canvases.drawn,
                operations.slice(_drawnFor.length)
            ];
        };

        const [canvas, operations] = runFor();
        if (!operations.length && !force) {
            if (canvases.drawn) dispatch(loading.actions.setRendering(false));
            else {
                dispatch(internal.action({ drawn: canvases.source }));
                dispatch(actions.scale({ force: true }));
            }
        } else {
            _drawnFor = operations;
            dispatch(internal.action({
                drawn: engine.draw(canvas, operations)
            }));
            dispatch(actions.scale({ force: true }));
        }
        done();
    }
}));

logic.push(createLogic({
    type: t.SCALE,
    cancelType: [t.SET_SOURCE, t.DRAW, t.SCALE],
    process({ getState, action }, dispatch, done) {
        const state = getState();
        const drawn = state.canvases.drawn;
        const scaled = state.canvases.scaled.canvas;
        const force = (action.payload) ? action.payload.force : false;
        if (!drawn) return done();
        console.log('scale');

        const dimensions = (action.payload)
            ? action.payload
            : state.views.dimensions;

        const factor = 1.3;
        const scaleOp = [{
            scale: {
                width: dimensions.width * factor,
                height: dimensions.width * factor
            }
        }];

        const newDims = () => engine.getDimensions(
            { width: drawn.width, height: drawn.height }, scaleOp
        );
        if (!force && scaled && isEqual(
            newDims(), { width: scaled.width, height: scaled.height }
        )) {
            console.log('stoped scaled');
            dispatch(loading.actions.setRendering(false));
            return done();
        }

        dispatch(internal.action({
            scaled: {
                id: state.canvases.scaled.id + 1,
                canvas: engine.draw(drawn, scaleOp)
            }
        }));
        dispatch(loading.actions.setRendering(false));
        done();
    }
}));

logic.push(createLogic({
    type: t.LAST_EXCLUDE,
    cancelType: [t.SET_SOURCE, t.DRAW, t.SCALE, t.LAST_EXCLUDE],
    process({ getState, action }, dispatch, done) {
        const state = getState();
        const drawn = state.canvases.drawn;
        const scaled = state.canvases.scaled.canvas;
        const force = (action.payload) ? action.payload.force : false;
        if (!drawn) return done();
        console.log('scale');

        const dimensions = (action.payload)
            ? action.payload
            : state.views.dimensions;

        const factor = 1.3;
        const scaleOp = [{
            scale: {
                width: dimensions.width * factor,
                height: dimensions.width * factor
            }
        }];

        const newDims = () => engine.getDimensions(
            { width: drawn.width, height: drawn.height }, scaleOp
        );
        if (!force && scaled && isEqual(
            newDims(), { width: scaled.width, height: scaled.height }
        )) {
            console.log('stoped scaled');
            dispatch(loading.actions.setRendering(false));
            return done();
        }

        dispatch(internal.action({
            scaled: {
                id: state.canvases.scaled.id + 1,
                canvas: engine.draw(drawn, scaleOp)
            }
        }));
        dispatch(loading.actions.setRendering(false));
        done();
    }
}));

export default {
    propTypes,
    reducer,
    actions,
    logic,
    selectors
};
