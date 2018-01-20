import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { values } from '../utils/types-actions';
import { defaultValues } from '../historian';
import views from '../views';
import loading from '../loading';
import { typesPre, historian, OVERWRITE } from './init';
import isEqual from 'lodash.isequal';

const propTypes = {
    index: () => PropTypes.number.isRequired,
    arr: () => PropTypes.array.isRequired,
    temp: () => PropTypes.object,
    checkpoint: () => PropTypes.object,
    can: () => PropTypes.shape({
        forwards: PropTypes.bool.isRequired,
        backwards: PropTypes.bool.isRequired
    }).isRequired
};

const { types: t, actions } = typesActions({
    pre: `${typesPre}_HISTORY`,
    types: ['RESET', 'BACKWARDS', 'FORWARDS', 'TEMP_FORGET']
});

const logic = [];
logic.push(createLogic({
    type: values(t),
    transform({ getState, action }, next) {
        const state = getState().edits;
        const payload = (() => {
            switch (action.type) {
            case t.RESET:
                return historian.restoreCheckpoint(state);
            case t.BACKWARDS:
                return historian.backwards(state);
            case t.FORWARDS:
                return historian.forwards(state);
            case t.TEMP_FORGET:
                return historian.forwards(state);
            default:
                return state;
            }
        })();
        next({ type: action.type, payload });
    },
    process({ getState, action }, dispatch, done) {
        const globalState = getState();
        const state = globalState.edits;
        const payload = action.payload;

        if (globalState.views.main !== 'text'
            && !isEqual(state.text, payload.text)) {
            dispatch(views.actions.setMain('text'));
        }

        if (state.source.id !== payload.source.id
        || !isEqual(state.image, payload.image)) {
            dispatch(loading.actions.setRendering(true));
        }

        dispatch({ type: OVERWRITE, payload });
        done();
    }
}));

export default {
    initialState: defaultValues,
    propTypes,
    actions,
    logic
};
