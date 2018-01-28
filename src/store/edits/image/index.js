import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { typeInTypes, values } from '../../utils/types-actions';
import { typesPre, writeAction } from '../init';
import selectors from './selectors';

const pre = `${typesPre}_IMAGE`;
const { types: t, typesBy, actions } = typesActions({
    pre,
    types: ['ROTATE', 'RESIZE', 'CROP', 'FLIP'],
    post: ['TEMP']
});

const initialState = {
    rotate: 0,
    resize: { width: null, height: null, widthRatio: 100, heightRatio: 100 },
    flip: false,
    crop: { x: null, y: null, width: null, height: null }
};

const propTypes = {
    rotate: PropTypes.number.isRequired,
    resize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        widthRatio: PropTypes.number.isRequired,
        heightRatio: PropTypes.number.isRequired
    }).isRequired,
    flip: PropTypes.bool.isRequired,
    crop: {
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number
    }
};

function main(state, { type, payload }) {
    const is = typeInTypes(type);

    switch (true) {
    case is(typesBy.type.FLIP):
        return {
            ...state,
            flip: !state.flip
        };
    case is(typesBy.type.ROTATE):
        return {
            ...state,
            rotate: payload,
            resize: {
                ...state.resize,
                width: null,
                height: null
            }
        };
    case is(typesBy.type.CROP):
        return {
            ...state,
            crop: payload,
            resize: {
                ...state.resize,
                width: null,
                height: null
            }
        };
    case is(typesBy.type.RESIZE):
        return {
            ...state,
            resize: payload
        };
    default:
        return state;
    }
}

const logic = [];
logic.push(createLogic({
    type: values(t),
    process({ getState, action }, dispatch, done) {
        const state = getState().edits.image;
        const payload = main(state, action);

        dispatch(writeAction(action.type, typesBy)({ image: payload }));
        done();
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic,
    selectors
};
