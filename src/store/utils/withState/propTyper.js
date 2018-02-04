import PropTypes from 'prop-types';
import warn from 'utils/warn';

function getType(obj, firstKey, actions) {
    const msg = () => warn(
        `withState couldn't get the types for some key '${firstKey}'`,
        'error'
    );
    if (!obj) return msg();

    if (typeof obj === 'function') {
        if (actions) return PropTypes.func.isRequired;
        else if (obj.name === 'bound checkType') return obj;
        else return msg();
    }

    const keys = Object.keys(obj);
    if (!keys.length) return msg();

    const ans = {};
    keys.forEach(key => {
        const type = getType(obj[key], firstKey);
        if (type) ans[key] = type;
    });
    return PropTypes.shape(ans).isRequired;
}

function propTyper(obj, actions = false) {
    return Object.keys(obj)
        .reduce((acc, key) => {
            const type = getType(obj[key], key, actions);
            if (type) acc[key] = type;
            return acc;
        }, {});
}

export default propTyper;
