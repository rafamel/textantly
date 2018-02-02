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
        const state = getState().edits.navigation;
        const payload = ((payload) => {
            switch (action.type) {
            case t.SET_MAIN:
                return { ...state, main: payload };
            case t.SET_IMAGE:
                return { ...state, image: payload };
            case t.SET_CROP:
                return { ...state, crop: payload };
            default:
                return state;
            }
        })(action.payload);

        dispatch(editsActions.writeSkip({ navigation: payload }));
        if (action.type === t.SET_CROP) cropRatio(action.payload, dispatch);
        done();
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic
};
