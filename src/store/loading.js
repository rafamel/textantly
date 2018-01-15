import PropTypes from 'prop-types';
import { typesActions } from './utils';

const { types: t, actions } = typesActions({
    pre: 'LOADING',
    types: ['SET_LOADING', 'SET_RENDERING']
});

const initialState = {
    loading: true,
    rendering: true
};
const propTypes = {
    loading: () => PropTypes.bool.isRequired,
    rendering: () => PropTypes.bool.isRequired
};

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.SET_LOADING:
        return {
            ...state,
            loading: payload
        };
    case t.SET_RENDERING:
        return {
            ...state,
            rendering: payload
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
