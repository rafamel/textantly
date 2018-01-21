import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { typesPre, insert } from './init';
import engine from 'engine';
import loading from '../loading';
import alerts from '../alerts';
import canvases from '../canvases';
import image from './image';
import config from 'config';

const { types, actions } = typesActions({
    pre: `${typesPre}_SOURCE`,
    types: ['SET_SOURCE', 'LOAD_SOURCE']
});

const initialState = {
    ...config.defaults.src,
    id: 0,
    from: false
};

const propTypes = {
    name: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    from: PropTypes
        .oneOfType([PropTypes.bool, PropTypes.string]).isRequired
};

function loadImage(src, dispatch) {
    return new Promise((resolve, reject) => {
        const loadFailed = () => {
            dispatch(alerts.actions.add('Image could not be loaded'));
            dispatch(loading.actions.setRendering(false));
            reject(Error());
        }
        dispatch(loading.actions.setRendering(true));
        const image = new Image();
        image.src = src;
        setTimeout(loadFailed, 8000);
        image.onerror = loadFailed;
        image.onload = () => resolve(engine.makeCanvas(image));
    });
}

const logic = [];
logic.push(createLogic({
    type: types.SET_SOURCE,
    cancelType: types.SET_SOURCE,
    process({ getState, action }, dispatch, done) {
        const state = getState().edits;
        let payload = action.payload;
        if (payload.src === state.source.src) return done();
        loadImage(payload.src, dispatch)
            .then(canvas => {
                payload = {
                    ...state,
                    image: image.initialState,
                    source: {
                        ...state.source,
                        ...payload,
                        id: payload.id + 1
                    }
                };
                insert({
                    action: { ...action, payload }, mode: 'HARD', getState, dispatch
                });
                dispatch(canvases.actions.setSource(canvas));
                done();
            })
            .catch(done);
    }
}));
logic.push(createLogic({
    type: types.LOAD_SOURCE,
    cancelType: values(types),
    process({ getState, action }, dispatch, done) {
        loadImage(getState().edits.source.src, dispatch)
            .then(canvas => {
                dispatch(canvases.actions.setSource(canvas));
                done();
            })
            .catch(done);
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic
};
