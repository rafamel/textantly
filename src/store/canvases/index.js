import PropTypes from 'prop-types';
import typesActions from '../utils/types-actions';
import { createLogic } from 'redux-logic';
import isEqual from 'lodash.isequal';
import engine, { Operation } from 'engine';
import selectors from './selectors';
import loading from '../loading';

const typesPre = 'CANVASES';
const { types: t, actions } = typesActions({
    pre: `${typesPre}_PUBLIC`,
    types: ['SET_SOURCE', 'DRAW', 'SCALE']
});

const initialState = {
    source: null,
    drawn: {
        canvas: null,
        forId: -1,
        forList: []
    },
    scaled: {
        id: -1,
        canvas: null,
        forId: -1
    }
};

const propTypes = {
    source: PropTypes.object,
    drawn: {
        canvas: PropTypes.object,
        forId: PropTypes.number.isRequired,
        forList: PropTypes.array.isRequired
    },
    scaled: {
        id: PropTypes.number.isRequired,
        canvas: PropTypes.object,
        forId: PropTypes.number.isRequired
    }
};

let internal = {};
internal.TPRIVATE = `${typesPre}_PRIVATE`;
internal.action = (payload) => ({ type: internal.TPRIVATE, payload });

function reducer(state = initialState, { type, payload }) {
    return (type === internal.TPRIVATE) ? { ...state, ...payload } : state;
}

const logic = [];
logic.push(createLogic({
    type: t.SET_SOURCE,
    cancelType: t.SET_SOURCE,
    process({ getState, action }, dispatch, done) {
        dispatch(loading.actions.setRendering(true));
        dispatch(internal.action({ source: action.payload }));
        dispatch(actions.draw({ force: true }));
        done();
    }
}));
logic.push(createLogic({
    type: t.DRAW,
    cancelType: [t.SET_SOURCE, t.DRAW],
    process({ getState, action }, dispatch, done) {
        const runFor = () => {
            const forList = canvases.drawn.forList;
            const opsList = operations.list;
            if (!canvases.drawn.canvas
                || force
                || canvases.drawn.forId > operations.id) {
                return [canvases.source, opsList];
            } else {
                return [canvases.drawn.canvas, opsList.slice(forList.length)];
            }
        };

        const state = getState();
        const canvases = state.canvases;
        const force = (action.payload) ? action.payload.force : false;
        const operations = state.edits.image.operations;

        if (!canvases.source) return done();
        dispatch(loading.actions.setRendering(true));

        if (!force
            && canvases.drawn.canvas
            && operations.id === canvases.drawn.forId) {
            dispatch(loading.actions.setRendering(false));
            done();
        }

        const [canvas, opsList] = runFor();
        dispatch(internal.action({
            drawn: {
                canvas: engine.draw(canvas, opsList),
                forId: operations.id,
                forList: operations.list
            }
        }));
        dispatch(actions.scale({ force: true }));
        done();
    }
}));
logic.push(createLogic({
    type: t.SCALE,
    cancelType: [t.SET_SOURCE, t.DRAW, t.SCALE],
    process({ getState, action }, dispatch, done) {
        const state = getState();
        const drawn = state.canvases.drawn.canvas;
        const scaled = state.canvases.scaled.canvas;
        const force = (action.payload) ? action.payload.force : false;
        if (!drawn) return done();
        dispatch(loading.actions.setRendering(true));

        const dimensions = state.views.dimensions;
        const factor = 1.3;
        const scaleOp = [new Operation('scale', {
            width: dimensions.width * factor,
            height: dimensions.width * factor
        })];

        const newDims = () => engine.getDimensions(
            { width: drawn.width, height: drawn.height }, scaleOp
        );
        if (!force && scaled && isEqual(
            newDims(), { width: scaled.width, height: scaled.height }
        )) {
            dispatch(loading.actions.setRendering(false));
            return done();
        }

        dispatch(internal.action({
            scaled: {
                id: state.canvases.scaled.id + 1,
                canvas: engine.draw(drawn, scaleOp),
                forId: state.canvases.drawn.forId
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
