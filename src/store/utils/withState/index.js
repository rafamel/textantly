import { connect } from 'react-redux';
import propTyper from './propTyper';
import { actions, propTypes } from '../../index';

export default function withState(...args) {
    const types = {};

    if (args[0]) {
        Object.assign(types, propTyper(args[0](propTypes)));
    }

    if (args[1]) {
        if (typeof args[1] === 'function') {
            args[1] = args[1](actions);
        }
        if (typeof args[1] === 'function') {
            Object.assign(types, propTyper(args[1](() => {})));
        } else {
            Object.assign(types, propTyper(args[1]));
        }
    }

    return {
        propTypes: types,
        connector: connect(...args)
    };
};
