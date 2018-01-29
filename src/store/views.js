import PropTypes from 'prop-types';
import { typesActions } from './utils';
import { createLogic } from 'redux-logic';
import isEqual from 'lodash.isequal';
import canvases from './canvases';

const { types: t, typesBy, actions } = typesActions({
    pre: 'VIEWS',
    types: [
        'SET_MOBILE',
        'SET_MAIN',
        'SET_IMAGE',
        'SET_DIMENSIONS'
    ],
    post: 'PRIVATE'
});

const initialState = {
    isMobile: false,
    main: 'text',
    image: {
        main: 'crop',
        crop: 'free'
    },
    dimensions: { width: 0, height: 0 }
};

const propTypes = {
    isMobile: PropTypes.bool.isRequired,
    main: PropTypes.string.isRequired,
    image: {
        main: PropTypes.string,
        crop: PropTypes.string.isRequired
    },
    dimensions: {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }
};

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.SET_MOBILE:
        return {
            ...state,
            isMobile: payload
        };
    case t.SET_MAIN:
        return {
            ...state,
            main: payload
        };
    case t.SET_IMAGE:
        return {
            ...state,
            image: {
                ...state.image,
                ...payload
            }
        };
    case typesBy.post.PRIVATE.SET_DIMENSIONS:
        return {
            ...state,
            dimensions: payload
        };
    default:
        return state;
    }
}

const logic = [];
logic.push(createLogic({
    type: t.SET_DIMENSIONS,
    cancelType: t.SET_DIMENSIONS,
    validate({ getState, action }, allow, reject) {
        const dimensions = getState().views.dimensions;
        const payload = action.payload;
        if (
            !payload
            || !payload.width
            || !payload.height
            || isEqual(payload, dimensions)
        ) {
            return reject(action);
        }
        allow(action);
    },
    process({ getState, action }, dispatch, done) {
        dispatch(actions.setDimensionsPrivate(action.payload));
        setTimeout(() => {
            dispatch(canvases.actions.scale());
            done();
        }, 300);
    }
}));

export default {
    initialState,
    propTypes,
    reducer,
    actions,
    logic
};
