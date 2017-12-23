import { createStore, combineReducers } from 'redux';
import image from './image';

const store = createStore(
    combineReducers({
        image: image.reducer
    })
);

const actions = {
    image: image.actions
};

export {
    store,
    actions
}
