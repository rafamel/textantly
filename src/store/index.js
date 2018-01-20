import { combineReducers } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import loading from './loading';
import views from './views';
import edits from './edits';
import alerts from './alerts';

const reducer = combineReducers({
    _loading: loading.reducer,
    views: views.reducer,
    edits: edits.reducer,
    alerts: alerts.reducer
});

const logic = createLogicMiddleware([
    ...edits.logic
]);

const actions = {
    _loading: loading.actions,
    views: views.actions,
    edits: edits.actions,
    alerts: alerts.actions
};

const propTypes = {
    _loading: loading.propTypes,
    views: views.propTypes,
    edits: edits.propTypes,
    alerts: alerts.propTypes
};

export {
    reducer,
    logic,
    actions,
    propTypes
};
