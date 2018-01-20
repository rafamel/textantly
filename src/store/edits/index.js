import { historian, OVERWRITE } from './init';
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
    return (type === OVERWRITE) ? payload : state;
}

export default {
    reducer,
    propTypes: {
        [historian.key]: history.propTypes,
        source: source.propTypes,
        text: text.propTypes,
        image: image.propTypes
    },
    logic: [
        ...history.logic,
        ...source.logic,
        ...text.logic,
        ...image.logic
    ],
    actions: {
        ...history.actions,
        ...source.actions,
        ...text.actions,
        ...image.actions
    }
};
