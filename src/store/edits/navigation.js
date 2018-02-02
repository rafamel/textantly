import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { typesPre, actions as editsActions } from './init';
import image from './image';

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

function cropRatio(payload, dispatch) {
    const ratio = (() => {
        switch (payload) {
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
    dispatch(image.actions.crop({ ...image.initialState.crop, ratio }));
}

const logic = [];
logic.push(createLogic({
    type: values(t),
    process({ getState, action }, dispatch, done) {
        const deliver = (load, skip = true) => {
            const payload = { navigation: load };
            if (skip) dispatch(editsActions.writeNextSkip(payload));
            else dispatch(editsActions.writeNext(payload));
        };

        const state = getState().edits.navigation;
        const { type, payload } = action;

        switch (type) {
        case t.SET_MAIN:
            deliver({ ...state, main: payload }, false);
            break;
        case t.SET_IMAGE:
            deliver({ ...state, image: payload });
            break;
        case t.SET_CROP:
            deliver({ ...state, crop: payload });
            cropRatio(payload, dispatch);
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
