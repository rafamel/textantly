import PropTypes from 'prop-types';
import { typesActions } from './utils';

const { types: t, actions } = typesActions({
    pre: 'ACTIVE_VIEWS',
    types: ['CHANGE_MAIN', 'CHANGE_IMAGE', 'SET_DIMENSIONS']
});

const initialState = {
    main: 'text',
    image: {
        main: null,
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
    case t.CHANGE_MAIN:
        return {
            ...state,
            image: {
                ...state.image,
                main: null
            },
            main: payload
        };
    case t.CHANGE_IMAGE:
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
    actions,
    types: t
};
