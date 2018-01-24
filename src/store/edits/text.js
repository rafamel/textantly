import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { typesPre, writeAction } from './init';
import config from 'config';

const { types: t, typesBy, actions } = typesActions({
    pre: `${typesPre}_TEXT`,
    types: ['SET_TEXT'],
    post: ['TEMP']
});

const initialState = {
    ...config.defaults.text
};

const propTypes = {
    textString: PropTypes.string.isRequired,
    fontFamily: PropTypes.string.isRequired,
    fontWeight: PropTypes
        .oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    alignment: PropTypes.string.isRequired,
    overlayPosition: PropTypes.string.isRequired,
    overlayWidth: PropTypes.number.isRequired,
    overlayHeight: PropTypes.number.isRequired,
    colorScheme: PropTypes.string.isRequired
};

const logic = [];
logic.push(createLogic({
    type: values(t),
    process({ getState, action }, dispatch, done) {
        const payload = {
            ...getState().edits.text,
            ...action.payload
        };
        dispatch(writeAction(action.type, typesBy)({ text: payload }));
        done();
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic
};
