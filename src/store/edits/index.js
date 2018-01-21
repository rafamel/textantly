import PropTypes from 'prop-types';
import { selectorWithType } from '../utils/withState';
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

let selectors = {};
selectors.doUpdate = selectorWithType({
    // When on mobile, only update
    // if changes are permanent
    propType: PropTypes.bool.isRequired,
    select: [
        state => state.edits[historian.key].temp,
        state => state.views.isMobile
    ],
    result: (temp, isMobile) => {
        return (!isMobile || !temp);
    }
});

export default {
    reducer,
    selectors,
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
