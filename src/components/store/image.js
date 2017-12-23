import typesActions from './types-actions';

const { types: t, actions } = typesActions({
    pre: 'IMAGE',
    types: ['CHANGE', 'REVERT']
});

const initialState = {
    src: 'static/default.png',
    name: '',
    last: {}
};

function reducer (state, { type, payload }) {
    if (!state) state = initialState;

    switch (type) {
        case t.CHANGE: {
            return {
                src: payload.src,
                name: payload.name,
                last: {
                    name: state.name,
                    src: state.src
                }
            };
        }
        case t.REVERT: {
            return {
                ...state.last,
                last: state.last
            }
        }
        default: {
            return state;
        }
    }
}

export default {
    reducer,
    actions,
    types: t
}
