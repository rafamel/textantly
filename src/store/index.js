import { createStore, combineReducers } from 'redux';
import activeEditor from './active-editor';
import loading from './loading';
import edits from './edits';
import alerts from './alerts';

const store = createStore(
    combineReducers({
        _activeEditor: activeEditor.reducer,
        _loading: loading.reducer,
        edits: edits.reducer,
        alerts: alerts.reducer
    })
);

const actions = {
    _activeEditor: activeEditor.actions,
    _loading: loading.actions,
    edits: edits.actions,
    alerts: alerts.actions
};

export {
    store as default,
    actions
};
