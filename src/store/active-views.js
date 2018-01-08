import typesActions from './types-actions';

const { types: t, actions } = typesActions({
    pre: 'ACTIVE_VIEWS',
    types: ['CHANGE_MAIN', 'CHANGE_IMAGE', 'CHANGE_CROP']
});

const initialState = {
    main: 'text',
    image: null,
    crop: 'free'
};

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.CHANGE_MAIN:
        return {
            ...state,
            image: initialState.image,
            main: payload
        };
    case t.CHANGE_IMAGE:
        return {
            ...state,
            image: payload
        };
    case t.CHANGE_CROP:
        return {
            ...state,
            crop: payload
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
