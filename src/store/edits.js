import typesActions from './types-actions';
import diffHistory, { defaultHistoryValues } from './diff-history';
import config from 'config';

const { types: t, actions } = typesActions({
    pre: `PERM_EDITS`,
    types: [
        'RESET',
        'BACKWARDS',
        'FORWARDS',
        'TEMP_FORGET',
        'CHANGE_SRC',
        'CHANGE_SRC_TEMP',
        'CHANGE_TEXT',
        'CHANGE_TEXT_TEMP',
        'CHANGE_IMAGE',
        'CHANGE_IMAGE_TEMP'
    ]
});

const initialState = {
    src: {
        name: config.defaults.src.name,
        src: config.defaults.src.src,
        from: false
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
        rotate: 0,
        flip: false
    },
    _history: defaultHistoryValues
};

function changeSrc(state, payload) {
    const image = (payload.src && state.src.src !== payload.src)
        ? initialState.image
        : state.image;
    return {
        ...state,
        image,
        src: {
            ...state.src,
            ...payload
        }
    };
}

function changeText(state, payload) {
    return {
        ...state,
        text: {
            ...state.text,
            ...payload
        }
    };
}

function changeImage(state, payload) {
    return {
        ...state,
        image: {
            ...state.image,
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
    case t.TEMP_FORGET:
        return history.tempForget(state);
    case t.CHANGE_SRC:
        return history.insert(state, changeSrc(state, payload));
    case t.CHANGE_SRC_TEMP:
        return history.tempInsert(state, changeSrc(state, payload));
    case t.CHANGE_TEXT:
        return history.insert(state, changeText(state, payload));
    case t.CHANGE_TEXT_TEMP:
        return history.tempInsert(state, changeText(state, payload));
    case t.CHANGE_IMAGE:
        return history.insert(state, changeImage(state, payload));
    case t.CHANGE_IMAGE_TEMP:
        return history.tempInsert(state, changeImage(state, payload));
    default:
        return state;
    }
}

export default {
    reducer,
    actions,
    types: t
};
