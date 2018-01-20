import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { typesPre, insert } from './init';
import config from 'config';

const { types, typesBy, actions } = typesActions({
    pre: `${typesPre}_TEXT`,
    types: ['SET_TEXT'],
    post: ['HARD', 'TEMP']
});

const initialState = {
    ...config.defaults.text
};

const propTypes = {
    textString: () => PropTypes.string.isRequired,
    fontFamily: () => PropTypes.string.isRequired,
    fontWeight: () => PropTypes
        .oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
    alignment: () => PropTypes.string.isRequired,
    overlayPosition: () => PropTypes.string.isRequired,
    overlayWidth: () => PropTypes.number.isRequired,
    overlayHeight: () => PropTypes.number.isRequired,
    colorScheme: () => PropTypes.string.isRequired
};

const logic = [];
logic.push(createLogic({
    type: values(types),
    process({ getState, action }, dispatch, done) {
        action.payload = {
            ...getState().edits.text,
            ...action.payload
        };
        insert({ key: 'text', action, typesBy, getState, dispatch });
        done();
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic
};
