import PropTypes from 'prop-types';

function isPropType(obj) {
    return Boolean(obj && obj.name === 'bound checkType');
}

function getType(obj, firstKey) {
    // eslint-disable-next-line
    const errorMsg = () => console.error(
        `Some type could not be retrieved on key "${firstKey}" for withState()`
    );
    if (!obj) return errorMsg();
    if (isPropType(obj)) return obj;

    const keys = Object.keys(obj);
    if (!keys.length) {
        if (typeof obj !== 'function') return errorMsg();
        else return PropTypes.func.isRequired;
    }
    const ans = {};
    keys.forEach(key => {
        ans[key] = getType(obj[key], firstKey);
    });
    return PropTypes.shape(ans).isRequired;
}

function propTyper(obj) {
    return Object.keys(obj)
        .reduce((acc, key) => {
            acc[key] = getType(obj[key], key);
            return acc;
        }, {});
}

export {
    propTyper as default,
    isPropType
};
