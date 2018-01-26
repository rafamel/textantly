import { historian, types as t } from './init';
import history from './history';
import image from './image';
import source from './source';
import text from './text';

const initialState = {
    [historian.key]: history.initialState,
    source: source.initialState,
    text: text.initialState,
    image: image.initialState
};

function reducer(state = initialState, { type, payload }) {
    switch (type) {
    case t.OVERWRITE:
        return payload;
    case t.WRITE_HARD:
        return historian.insert(state, { ...state, ...payload });
    case t.WRITE_TEMP:
        return historian.tempInsert(state, { ...state, ...payload });
    default:
        return state;
    }
}

export default {
    initialState,
    reducer,
    propTypes: {
        source: source.propTypes,
        text: text.propTypes,
        image: image.propTypes
    },
    actions: {
        ...history.actions,
        source: source.actions,
        text: text.actions,
        image: image.actions
    },
    logic: [
        ...history.logic,
        ...source.logic,
        ...text.logic,
        ...image.logic
    ],
    selectors: {
        ...history.selectors,
        image: image.selectors
    }
};
