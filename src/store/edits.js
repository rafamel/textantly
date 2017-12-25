import merge from 'lodash.merge';
import config from 'config';
import typesActions from './types-actions';


const { types: t, actions } = typesActions({
    pre: 'EDITS',
    types: ['RESET', 'CHANGE_TEXT']
});

const initialState = {
    history: [],
    current: {
        text: {
            textString: config.defaults.text.textString,
            fontFamily: config.defaults.text.fontFamily,
            fontWeight: config.defaults.text.fontWeight,
            alignment: config.defaults.text.alignment
        },
        image: {
            some: 'nice'
        }
    }
};

function reducer (state = initialState, { type, payload }) {
    switch (type) {
        case t.RESET: {
            return initialState;
        }
        case t.CHANGE_TEXT: {
            return merge({}, state, { current: { text: payload } });
        }
        default: {
            return state;
        }
    }
}

export default {
    reducer,
    actions,
    types: t
}
