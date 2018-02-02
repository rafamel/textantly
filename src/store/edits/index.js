import { historian, types as t } from './init';
import history from './history';
import navigation from './navigation';
import image from './image';
import source from './source';
import text from './text';

const initialState = {
    [historian.key]: history.initialState,
    navigation: navigation.initialState,
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
    case t.WRITE_NEXT:
        return historian.insertNext(state, { ...state, ...payload });
    case t.WRITE_NEXT_SKIP:
        return historian.insertNext(state, { ...state, ...payload }, true);
    case t.WRITE_TEMP:
        return historian.insertTemp(state, { ...state, ...payload });
    default:
        return state;
    }
}

export default {
    initialState,
    reducer,
    propTypes: {
        navigation: navigation.propTypes,
        source: source.propTypes,
        text: text.propTypes,
        image: image.propTypes
    },
    actions: {
        ...history.actions,
        navigation: navigation.actions,
        source: source.actions,
        text: text.actions,
        image: image.actions
    },
    logic: [
        ...history.logic,
        ...navigation.logic,
        ...source.logic,
        ...text.logic,
        ...image.logic
    ],
    selectors: {
        ...history.selectors,
        image: image.selectors
    }
};
