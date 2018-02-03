import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { typesPre, actions as editsActions } from './init';
import image from './image';
import history from './history';

const { types: t, actions } = typesActions({
    pre: `${typesPre}_NAVIGATION`,
    types: ['SET_MAIN', 'SET_IMAGE', 'SET_CROP']
});

const initialState = {
    main: 'text',
    image: 'crop',
    crop: 'free'
};

const propTypes = {
    main: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    crop: PropTypes.string.isRequired
};

function cropRatioDispatch({ name, on, dispatch }) {
    const ratio = (() => {
        switch (name) {
        case 'facebook':
            return 1200 / 630;
        case 'youtube':
            return 1280 / 720;
        case 'square':
            return 1;
        default:
            return null;
        }
    })();
    dispatch(image.actions.crop({ ...on, ratio }));
}

const logic = [];
logic.push(createLogic({
    type: [t.SET_MAIN, t.SET_IMAGE, t.SET_CROP],
    process({ getState, action }, dispatch, done) {
        const deliver = (load, skip = true) => {
            const payload = { navigation: load };
            if (skip) dispatch(editsActions.writeNextSkip(payload));
            else dispatch(editsActions.writeNext(payload));
        };

        const editsState = getState().edits;
        const state = editsState.navigation;
        const { type, payload } = action;
        const setCropRatio = (name = state.crop, reset = false) => {
            const x = (reset) ? image.initialState.crop : editsState.image.crop;
            cropRatioDispatch({ name, on: x, dispatch });
        };

        switch (type) {
        case t.SET_MAIN:
            const toSet = payload || state.main;
            deliver({ ...state, main: toSet }, false);
            if (toSet === 'image' && state.image === 'crop') setCropRatio();
            break;
        case t.SET_IMAGE:
            deliver({ ...state, image: payload });
            if (payload === 'crop') setCropRatio();
            break;
        case t.SET_CROP:
            deliver({ ...state, crop: payload });
            setCropRatio(payload, true);
            break;
        default:
            return done();
        }

        done();
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic
};
