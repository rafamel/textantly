import typesActions from './types-actions';

const { types: t, actions } = typesActions({
    pre: 'IMAG',
    types: ['CHANGE', 'REVERT']
});

const initialState = {
    src: 'static/default.png',
    name: '',
    last: {}
};

function reducer (state = initialState, { type, payload }) {
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
