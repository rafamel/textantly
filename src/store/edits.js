import typesActions from './types-actions';
import diffHistory, { defaultHistoryValues } from './diff-history';
import config from 'config';

const { types: t, actions } = typesActions({
    pre: `PERM_EDITS`,
    types: [
        'RESET',
        'BACKWARDS',
        'HARD_BACKWARDS',
        'FORWARDS',
        'CHANGE_TEXT',
        'CHANGE_TEXT_TEMP',
        'CHANGE_SRC'
    ]
});

const initialState = {
    src: {
        name: config.defaults.src.name,
        src: config.defaults.src.src
    },
    text: {
        textString: config.defaults.text.textString,
        fontFamily: config.defaults.text.fontFamily,
        fontWeight: config.defaults.text.fontWeight,
        alignment: config.defaults.text.alignment,
        overlayPosition: config.defaults.text.overlayPosition,
        overlayWidth: config.defaults.text.overlayWidth,
        overlayHeight: config.defaults.text.overlayHeight,
        colorScheme: config.defaults.text.colorScheme
    },
    image: {
        some: 'nice'
    },
    _history: defaultHistoryValues
};

function changeText(state, payload) {
    return {
        ...state,
        text: {
            ...state.text,
            ...payload
        }
    };
}

const history = diffHistory('_history');

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.RESET:
        return history.insert(state, initialState);
    case t.BACKWARDS:
        return history.backwards(state);
    case t.FORWARDS:
        return history.forwards(state);
    case t.CHANGE_TEXT:
        return history.insert(
            state,
            changeText(state, payload)
        );
    case t.CHANGE_TEXT_TEMP:
        return history.tempInsert(
            state,
            changeText(state, payload)
        );
    case t.CHANGE_SRC:
        return history.insert(state, {
            ...state,
            src: {
                ...state.src,
                ...payload
            }
        });
    default:
        return state;
    }
}

export default {
    reducer,
    actions,
    types: t
};
