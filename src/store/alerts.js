import PropTypes from 'prop-types';
import { typesActions } from './utils';

class Alert {
    constructor(string) {
        this.alert = string;
        this.timestamp = Date.now();
    }
}

const { types: t, actions } = typesActions({
    pre: 'ALERTS',
    types: ['CLOSE_CURRENT', 'ADD']
});

const initialState = {
    current: null,
    stack: []
};

const propTypes = {
    current: PropTypes.instanceOf(Alert)
};

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.ADD:
        const alert = new Alert(payload);
        if (!state.current) {
            return {
                ...state,
                current: alert
            };
        }
        return {
            ...state,
            stack: state.stack.concat([alert])
        };
    case t.CLOSE_CURRENT:
        if (!state.stack.length) {
            return {
                ...state,
                current: null
            };
        }
        return {
            current: state.stack[0],
            stack: state.stack.slice(1)
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
