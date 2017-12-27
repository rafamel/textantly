import typesActions from './types-actions';

const { types: t, actions } = typesActions({
    pre: 'ALERTS',
    types: ['CLOSE_CURRENT', 'ADD']
});

const initialState = {
    current: null,
    stack: []
};

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.ADD:
        if (!state.current) {
            return {
                ...state,
                current: payload
            };
        }
        return {
            ...state,
            stack: state.stack.concat([payload])
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
    reducer,
    actions,
    types: t
};
