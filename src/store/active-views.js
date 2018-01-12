import PropTypes from 'prop-types';
import { typesActions } from './utils';

const { types: t, actions } = typesActions({
    pre: 'ACTIVE_VIEWS',
    types: ['CHANGE_MAIN', 'CHANGE_IMAGE']
});

const initialState = {
    main: 'text',
    image: {
        main: null,
        crop: 'free'
    }
};

const propTypes = {
    main: PropTypes.string.isRequired,
    image: {
        main: PropTypes.string,
        crop: PropTypes.string.isRequired
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
