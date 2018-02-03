import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { typesPre, actions as editsActions } from './init';
import engine from 'engine';
import loading from '../loading';
import alerts from '../alerts';
import canvases from '../canvases';
import image from './image';
import config from 'config';

const { types: t, actions } = typesActions({
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
        .oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    id: PropTypes.number.isRequired
};

function loadImage(src, dispatch) {
    return new Promise((resolve, reject) => {
        const loadFailed = () => {
            dispatch(alerts.actions.add('Image could not be loaded'));
            dispatch(loading.actions.setRendering(false));
            reject(Error());
        };
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
    type: t.SET_SOURCE,
    cancelType: t.SET_SOURCE,
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
                        id: state.source.id + 1
                    }
                };
                if (state.navigation.main === 'image'
                    && state.navigation.image === 'crop') {
                    payload.image.crop.ratio = state.image.crop.ratio;
                }
                dispatch(editsActions.writeHard(payload));
                dispatch(canvases.actions.setSource(canvas));
                done();
            })
            .catch(done);
    }
}));
logic.push(createLogic({
    type: t.LOAD_SOURCE,
    cancelType: values(t),
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
