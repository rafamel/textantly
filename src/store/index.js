import { createStore, combineReducers } from 'redux';
import activeEditor from './active-editor';
import loading from './loading';
import image from './image';
import edits from './edits';

const store = createStore(
    combineReducers({
        _activeEditor: activeEditor.reducer,
        _loading: loading.reducer,
        image: image.reducer,
        edits: edits.reducer
    })
);

const actions = {
    _activeEditor: activeEditor.actions,
    _loading: loading.actions,
    image: image.actions,
    edits: edits.actions
};

export {
    store as default,
    actions
};
