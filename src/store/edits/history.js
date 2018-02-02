import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import { defaultValues } from '../historian';
import typesActions, { values } from '../utils/types-actions';
import { selectorWithType } from '../utils/withState';
import { typesPre, historian, actions as editsActions } from './init';
import canvases from '../canvases';
import source from './source';
import image from './image';
import text from './text';
import isEqual from 'lodash.isequal';

const { types: t, actions } = typesActions({
    pre: `${typesPre}_HISTORY`,
    types: ['RESET', 'BACKWARDS', 'FORWARDS']
});

const logic = [];
logic.push(createLogic({
    type: values(t),
    transform({ getState, action }, next) {
        const state = getState().edits;
        const payload = (() => {
            switch (action.type) {
            case t.RESET:
                return historian.insert(state, {
                    ...state,
                    text: text.initialState,
                    image: image.initialState,
                    navigation: {
                        ...state.navigation,
                        crop: 'free'
                    }
                });
            case t.BACKWARDS:
                return historian.backwards(state);
            case t.FORWARDS:
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

        dispatch(editsActions.overwrite(payload));
        if (state.source.id !== payload.source.id) {
            dispatch(source.actions.loadSource());
        } else if (payload.navigation.main !== 'image'
            && !isEqual(state.image, payload.image)) {
            // Can happen on resets
            dispatch(canvases.actions.draw());
        }
        done();
    }
}));

const selectors = {};
selectors.can = selectorWithType({
    propType: PropTypes.shape({
        forwards: PropTypes.bool.isRequired,
        backwards: PropTypes.bool.isRequired
    }).isRequired,
    select: [
        state => state.edits[historian.key].can.forwards,
        state => state.edits[historian.key].can.backwards
    ],
    result: (forwards, backwards) => {
        return { forwards, backwards };
    }
});
selectors.isTemp = selectorWithType({
    propType: PropTypes.bool.isRequired,
    select: [
        state => state.edits[historian.key].temp
    ],
    result: (temp) => {
        return Boolean(temp);
    }
});

export default {
    initialState: defaultValues,
    actions,
    logic,
    selectors
};
