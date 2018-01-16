import PropTypes from 'prop-types';

function getType(obj, firstKey, actions) {
    if (!obj) return;

    if (typeof obj === 'function') {
        if (actions) return PropTypes.func.isRequired;
        else return obj();
    }

    const keys = Object.keys(obj);
    if (!keys.length) return;

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
