import PropTypes from 'prop-types';
import { typesActions } from './utils';

const { types: t, actions } = typesActions({
    pre: 'LOADING',
    types: ['START', 'STOP']
});

const initialState = true;
const propTypes = PropTypes.bool.isRequired;

function reducer(state = initialState, { type }) {
    switch (type) {
    case t.START:
        return true;
    case t.STOP:
        return false;
    default:
        return state;
    }
}

export default {
    propTypes,
    reducer,
    actions,
    types: t
};
