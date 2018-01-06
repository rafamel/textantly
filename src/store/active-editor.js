import typesActions from './types-actions';

const { types: t, actions } = typesActions({
    pre: 'ACTIVE_EDITOR',
    types: ['TOGGLE', 'CHANGE']
});

const initialState = 'text';

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.TOGGLE:
        return (state === 'text')
            ? 'image'
            : 'text';
    case t.CHANGE:
        return payload;
    default:
        return state;
    }
}

export default {
    reducer,
    actions,
    types: t
};
