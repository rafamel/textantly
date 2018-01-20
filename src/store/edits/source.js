import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { typesPre, insert } from './init';
import loading from '../loading';
import image from './image';
import config from 'config';

const { types, typesBy, actions } = typesActions({
    pre: `${typesPre}_SOURCE`,
    types: ['SET_SOURCE'],
    post: ['HARD', 'TEMP']
});

const initialState = {
    ...config.defaults.src,
    id: 0,
    from: false,
    dimensions: { width: 668, height: 367 }
};

const propTypes = {
    name: () => PropTypes.string.isRequired,
    src: () => PropTypes.string.isRequired,
    from: () => PropTypes
        .oneOfType([
            PropTypes.bool,
            PropTypes.string
        ]).isRequired,
    dimensions: {
        width: () => PropTypes.number.isRequired,
        height: () => PropTypes.number.isRequired
    }
};

const logic = [];
logic.push(createLogic({
    type: values(types),
    process({ getState, action }, dispatch, done) {
        const state = getState().edits;
        let payload = {
            ...state,
            source: { ...state.source, ...action.payload }
        };
        if (payload.source.src !== state.source.src) {
            payload.image = image.initialState;
            payload.source.id++;
            dispatch(loading.actions.setRendering(true));
        }

        insert(
            { action: { ...action, payload }, typesBy, getState, dispatch }
        );
        done();
    }
}));

export default {
    initialState,
    propTypes,
    actions,
    logic
};
