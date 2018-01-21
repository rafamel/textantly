import { combineReducers } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import loading from './loading';
import views from './views';
import edits from './edits';
import canvases from './canvases';
import alerts from './alerts';

const reducer = combineReducers({
    _loading: loading.reducer,
    views: views.reducer,
    edits: edits.reducer,
    canvases: canvases.reducer,
    alerts: alerts.reducer
});

const logic = createLogicMiddleware([
    ...edits.logic,
    ...views.logic,
    ...canvases.logic
]);

const actions = {
    _loading: loading.actions,
    views: views.actions,
    edits: edits.actions,
    canvases: canvases.actions,
    alerts: alerts.actions
};

const selectors = {
    edits: edits.selectors,
    canvases: canvases.selectors
}

const propTypes = {
    _loading: loading.propTypes,
    views: views.propTypes,
    edits: edits.propTypes,
    canvases: canvases.propTypes,
    alerts: alerts.propTypes
};

export {
    reducer,
    logic,
    selectors,
    actions,
    propTypes
};
