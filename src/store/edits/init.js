import Historian from '../historian';
import { typeInTypes } from '../utils/types-actions';

const typesPre = 'EDITS';
const OVERWRITE = `${typesPre}_OVERWRITE`;
const historian = Historian({ key: '_history' });

function insert({ key, action, mode, typesBy, getState, dispatch }) {
    const state = getState().edits;
    let { type, payload } = action;
    const is = (!mode) ? typeInTypes(type) : null;
    if (key) payload = { ...state, [key]: payload };
    payload = (() => {
        switch (true) {
        case (mode && mode.toUpperCase() === 'HARD')
            || (is && is(typesBy.post.HARD)):
            return historian.insert(state, payload);
        case (mode && mode.toUpperCase() === 'TEMP')
            || (is && is(typesBy.post.TEMP)):
            return historian.tempInsert(state, payload);
        default:
            return state;
        }
    })();
    dispatch({ type: OVERWRITE, payload });
};

export {
    historian,
    insert,
    typesPre,
    OVERWRITE
};
