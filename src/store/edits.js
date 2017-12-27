import merge from 'lodash.merge';
import config from 'config';
import typesActions from './types-actions';

const { types: t, actions } = typesActions({
    pre: 'EDITS',
    types: [
        'RESET',
        'BACKWARDS',
        'HARD_BACKWARDS',
        'FORWARDS',
        'CHANGE_TEXT',
        'CHANGE_SRC'
    ]
});

const initialState = {
    currentHistoryIndex: -1,
    history: [],
    current: {
        src: {
            name: config.defaults.src.name,
            src: config.defaults.src.src
        },
        text: {
            textString: config.defaults.text.textString,
            fontFamily: config.defaults.text.fontFamily,
            fontWeight: config.defaults.text.fontWeight,
            alignment: config.defaults.text.alignment
        },
        image: {
            some: 'nice'
        }
    }
};

function reducer(state = initialState, { type, payload }) {
    const addPreviousToHistory = () => {
        const { history, current, currentHistoryIndex } = state;
        return {
            currentHistoryIndex: -1,
            history: (currentHistoryIndex === -1)
                ? history.concat([current])
                : history.slice(0, currentHistoryIndex).concat([current]),
            current
        };
    };
    switch (type) {
    case t.RESET:
        return {
            ...addPreviousToHistory(),
            current: initialState.current
        };
    case t.BACKWARDS:
        let select, savedState;
        if (state.currentHistoryIndex === -1) {
            select = state.history.length - 1;
            savedState = addPreviousToHistory();
        } else {
            select = state.currentHistoryIndex - 1;
            savedState = state;
        }
        if (select < 0) return state;
        return {
            ...savedState,
            currentHistoryIndex: select,
            current: state.history[select]
        };
    case t.HARD_BACKWARDS:
        if (state.currentHistoryIndex === -1) {
            return {
                currentHistoryIndex: -1,
                history: state.history.slice(0, -1) || [],
                current: state.history.slice(-1)[0]
            }
        }
        return {
            currentHistoryIndex: state.currentHistoryIndex - 1,
            history: state.history
                .slice(0, state.currentHistoryIndex)
                .concat(
                    state.history.slice(state.currentHistoryIndex + 1)
                ),
            current: state.history[state.currentHistoryIndex - 1]
        }
    case t.FORWARDS:
        if (state.currentHistoryIndex === -1
            || state.currentHistoryIndex >= state.history.length - 1) {
            return state;
        }
        return {
            ...state,
            currentHistoryIndex: state.currentHistoryIndex + 1,
            current: state.history[state.currentHistoryIndex + 1]
        };
    case t.CHANGE_TEXT:
        return merge(
            {},
            addPreviousToHistory(),
            { current: { text: payload } }
        );
    case t.CHANGE_SRC:
        return merge(
            {},
            addPreviousToHistory(),
            { current: { src: payload } }
        );
    default:
        return state;
    }
}

export default {
    reducer,
    actions,
    types: t
};
