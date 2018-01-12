import { combineReducers } from 'redux';
import loading from './loading';
import activeViews from './active-views';
import edits from './edits';
import alerts from './alerts';

const reducer = combineReducers({
    _loading: loading.reducer,
    _activeViews: activeViews.reducer,
    edits: edits.reducer,
    alerts: alerts.reducer
});

const actions = {
    _loading: loading.actions,
    _activeViews: activeViews.actions,
    edits: edits.actions,
    alerts: alerts.actions
};

const propTypes = {
    _loading: loading.propTypes,
    _activeViews: activeViews.propTypes,
    edits: edits.propTypes,
    alerts: alerts.propTypes
};

export {
    reducer,
    actions,
    propTypes
};
