import typesActions from './types-actions';

const { types: t, actions } = typesActions({
    pre: 'LOADING',
    types: ['START', 'STOP']
});

const initialState = true;

function reducer(state = initialState, { type }) {
    switch (type) {
    case t.START:
        return true;
    case t.STOP:
        return false;
    default:
        return state;
    }
}

export default {
    reducer,
    actions,
    types: t
};
