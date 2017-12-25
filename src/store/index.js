import { createStore, combineReducers } from 'redux';
import image from './image';
import activeEditor from './active-editor';
import edits from './edits';

const store = createStore(
    combineReducers({
        _activeEditor: activeEditor.reducer,
        image: image.reducer,
        edits: edits.reducer
    })
);

const actions = {
    _activeEditor: activeEditor.actions,
    image: image.actions,
    edits: edits.actions
};

export {
    store as default,
    actions
}
