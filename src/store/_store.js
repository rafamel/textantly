import { createStore, applyMiddleware } from 'redux';
import { reducer, logic } from './index';

const middleware = applyMiddleware(logic);
export default createStore(reducer, middleware);
