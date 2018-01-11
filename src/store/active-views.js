import typesActions from './types-actions';

const { types: t, actions } = typesActions({
    pre: 'ACTIVE_VIEWS',
    types: ['CHANGE_MAIN', 'CHANGE_IMAGE', 'CHANGE_DIMENSIONS']
});

const initialState = {
    main: 'text',
    image: {
        main: null,
        crop: 'free'
    },
    dimensions: {
        canvas: { width: 0, height: 0 }
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
    case t.CHANGE_DIMENSIONS:
        return {
            ...state,
            dimensions: {
                ...state.dimensions,
                ...payload
            }
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
