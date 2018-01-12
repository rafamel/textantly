import PropTypes from 'prop-types';
import { typesActions } from './utils';
import historyUtil, {
    defaultHistoryValues,
    propTypes as historyTypes
} from './history';
import config from 'config';

const { types: t, actions } = typesActions({
    pre: `PERM_EDITS`,
    types: [
        'RESET',
        'BACKWARDS',
        'FORWARDS',
        'TEMP_FORGET',
        'CHANGE_SOURCE',
        'CHANGE_SOURCE_TEMP',
        'CHANGE_TEXT',
        'CHANGE_TEXT_TEMP',
        'CHANGE_IMAGE',
        'CHANGE_IMAGE_TEMP'
    ]
});

const initialState = {
    _history: defaultHistoryValues,
    source: {
        ...config.defaults.src,
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
    _history: historyTypes,
    source: {
        name: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
        from: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string
        ]).isRequired,
        dimensions: {
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired
        }
    },
    text: {
        textString: PropTypes.string.isRequired,
        fontFamily: PropTypes.string.isRequired,
        fontWeight: PropTypes
            .oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
        alignment: PropTypes.string.isRequired,
        overlayPosition: PropTypes.string.isRequired,
        overlayWidth: PropTypes.number.isRequired,
        overlayHeight: PropTypes.number.isRequired,
        colorScheme: PropTypes.string.isRequired
    },
    image: {
        rotate: PropTypes.number.isRequired,
        resize: {
            width: PropTypes.number,
            height: PropTypes.number
        },
        flip: PropTypes.bool.isRequired
    }
};

function changeSource(state, payload) {
    const image = (payload.src && state.source.src !== payload.src)
        ? initialState.image
        : state.image;
    return {
        ...state,
        image,
        source: {
            ...state.source,
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

const history = historyUtil('_history');

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
    case t.CHANGE_SOURCE:
        return history.insert(state, changeSource(state, payload));
    case t.CHANGE_SOURCE_TEMP:
        return history.tempInsert(state, changeSource(state, payload));
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
    propTypes,
    reducer,
    actions,
    types: t
};
