import PropTypes from 'prop-types';

function getType(obj, firstKey, actions) {
    // eslint-ignore-next-line
    const msg = () => {
        console.error(`withState couldn't get the types for some key '${firstKey}'`);
    };
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
