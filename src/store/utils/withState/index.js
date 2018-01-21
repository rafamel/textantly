import { connect } from 'react-redux';
import propTyper from './propTyper';
import { actions, propTypes } from '../../index';
import { createSelector } from 'reselect';

const isProduction = (process.env.NODE_ENV === 'production');
const ptSymbol = Symbol('proptypes');

function selectorWithType(
    { propType, select, result },
    selectorCreator = createSelector
) {
    const builtSelector = selectorCreator(select, result);
    return function (...args) {
        return (args[0][ptSymbol])
            ? propType
            : builtSelector(...args);
    };
}

export { selectorWithType };
export default function withState(...args) {

    if (args[1] && typeof args[1] === 'function') {
        args[1] = args[1](actions);
    }

    const types = {};
    if (!isProduction) {
        if (args[0]) {
            propTypes[ptSymbol] = true;
            Object.assign(types, propTyper(args[0](propTypes)));

        }
        if (args[1]) {
            Object.assign(types, propTyper(
                ((typeof args[1] === 'function') ? args[1](() => {}) : args[1]),
                true
            ));
        }
    }

    return {
        propTypes: types,
        connector: connect(...args)
    };
};
