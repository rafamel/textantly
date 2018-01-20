import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { typeInTypes, values } from '../utils/types-actions';
import { typesPre, insert } from './init';

const { types, typesBy, actions } = typesActions({
    pre: `${typesPre}_IMAGE`,
    types: ['SET_IMAGE'],
    post: ['HARD', 'TEMP']
});

const initialState = {
    rotate: 0,
    resize: { width: null, height: null },
    flip: false
};

const propTypes = {
    rotate: () => PropTypes.number.isRequired,
    resize: {
        width: () => PropTypes.number,
        height: () => PropTypes.number
    },
    flip: () => PropTypes.bool.isRequired
};

function main({ state, payload, is }) {
    switch (true) {
    case is(typesBy.type.SET_IMAGE):
        return { ...state, ...payload };
    default:
        return state;
    }
}

const logic = [];
logic.push(createLogic({
    type: values(types),
    process({ getState, action }, dispatch, done) {
        action.payload = main({
            state: getState().edits.image,
            payload: action.payload,
            is: typeInTypes(action.type)
        });

        insert({ key: 'image', action, typesBy, getState, dispatch });
        done();
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic
};
