import PropTypes from 'prop-types';
import { typesActions } from './utils';

const { types: t, actions } = typesActions({
    pre: 'VIEWS',
    types: ['SET_MOBILE', 'SET_MAIN', 'SET_IMAGE', 'SET_DIMENSIONS']
});

const initialState = {
    isMobile: false,
    main: 'text',
    image: {
        main: 'crop',
        crop: 'free'
    },
    dimensions: { width: 0, height: 0 }
};

const propTypes = {
    main: () => PropTypes.string.isRequired,
    image: {
        main: () => PropTypes.string,
        crop: () => PropTypes.string.isRequired
    },
    dimensions: {
        width: () => PropTypes.number.isRequired,
        height: () => PropTypes.number.isRequired
    }
};

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.SET_MOBILE:
        return {
            ...state,
            isMobile: payload
        };
    case t.SET_MAIN:
        return {
            ...state,
            main: payload
        };
    case t.SET_IMAGE:
        return {
            ...state,
            image: {
                ...state.image,
                ...payload
            }
        };
    case t.SET_DIMENSIONS:
        return {
            ...state,
            dimensions: payload
        };
    default:
        return state;
    }
}

export default {
    propTypes,
    reducer,
    actions
};
