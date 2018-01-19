import PropTypes from 'prop-types';
import { createLogic } from 'redux-logic';
import typesActions, { typeInTypes, values } from './utils/types-actions';
import Historian, {
    defaultValues as historianDefaults,
    propTypes as historianTypes
} from './historian';
import config from 'config';
import loading from './loading';
import activeViews from './active-views';
import isEqual from 'lodash.isequal';

const initialState = {
    _history: historianDefaults,
    source: {
        ...config.defaults.src,
        id: 0,
        from: false,
        dimensions: { width: 668, height: 367 }
    },
    text: {
        ...config.defaults.text
    },
    image: {
        rotate: 0,
        resize: { width: null, height: null },
        flip: false
    }
};

const propTypes = {
    _history: historianTypes,
    source: {
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
    },
    text: {
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
    },
    image: {
        rotate: () => PropTypes.number.isRequired,
        resize: {
            width: () => PropTypes.number,
            height: () => PropTypes.number
        },
        flip: () => PropTypes.bool.isRequired
    }
};

const typesPre = 'EDITS';
const FULL_OVERWRITE = `${typesPre}_FULL_OVERWRITE`;
const historian = Historian({ key: '_history' });

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case FULL_OVERWRITE:
        return payload;
    default:
        return state;
    }
}

function setRendering({ state, payload }, dispatch) {
    if (state.source.src !== payload.source.src
    || !isEqual(state.image, payload.image)) {
        dispatch(loading.actions.setRendering(true));
    }
}

const main = typesActions({
    pre: typesPre,
    types: ['SET_SOURCE', 'SET_TEXT', 'SET_IMAGE'],
    post: ['HARD', 'TEMP']
});
main.logic = createLogic({
    type: values(main.types),
    transform({ getState, action }, next) {
        let payload = action.payload;
        payload = (() => {
            const state = getState().edits;
            const is = typeInTypes(action.type);

            switch (true) {
            case is(main.typesBy.type.SET_SOURCE):
                return {
                    ...state,
                    image: (payload.src && payload.src !== state.source.src)
                        ? initialState.image
                        : state.image,
                    source: {
                        ...state.source,
                        ...payload,
                        id: (state.source.src === payload.src)
                            ? state.source.id : state.source.id + 1
                    }
                };
            case is(main.typesBy.type.SET_TEXT):
                return {
                    ...state,
                    text: { ...state.text, ...payload }
                };
            case is(main.typesBy.type.SET_IMAGE):
                return {
                    ...state,
                    image: { ...state.image, ...payload }
                };
            default:
                return state;
            }
        })();
        next({ type: action.type, payload });
    },
    process({ getState, action }, dispatch, done) {
        let payload = action.payload;
        const state = getState().edits;
        const is = typeInTypes(action.type);

        if (is(main.typesBy.type.SET_SOURCE)) {
            setRendering({ state, payload }, dispatch);
        }

        payload = (() => {
            switch (true) {
            case is(main.typesBy.post.HARD):
                return historian.insert(state, payload);
            case is(main.typesBy.post.TEMP):
                return historian.tempInsert(state, payload);
            default:
                return state;
            }
        })();
        dispatch({ type: FULL_OVERWRITE, payload });
        done();
    }
});

const history = typesActions({
    pre: `${typesPre}_HISTORY`,
    types: ['RESET', 'BACKWARDS', 'FORWARDS', 'TEMP_FORGET']
});

history.logic = createLogic({
    type: values(history.types),
    transform({ getState, action }, next) {
        const state = getState().edits;
        const payload = (() => {
            switch (action.type) {
            case history.types.RESET:
                return historian.insert(state, initialState);
            case history.types.BACKWARDS:
                return historian.backwards(state);
            case history.types.FORWARDS:
                return historian.forwards(state);
            case history.types.TEMP_FORGET:
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

        if (globalState._activeViews.main !== 'text'
            && !isEqual(state.text, payload.text)) {
            dispatch(activeViews.actions.changeMain('text'));
        }

        setRendering({ state, payload }, dispatch);
        dispatch({ type: FULL_OVERWRITE, payload });
        done();
    }
});

export default {
    propTypes,
    reducer,
    logic: [
        main.logic,
        history.logic
    ],
    actions: {
        ...main.actions,
        ...history.actions
    },
    types: {
        ...main.types,
        ...history.types
    }
};
