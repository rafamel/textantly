import PropTypes from 'prop-types';

function getType(obj, firstKey, actions) {
    // eslint-disable-next-line
    const errorMsg = () => console.error(
        `Some type could not be retrieved on key "${firstKey}" for withState()`
    );
    if (!obj) return errorMsg();
    if (typeof obj === 'function') {
        if (actions) return PropTypes.func.isRequired;
        else return obj();
    }

    const keys = Object.keys(obj);
    if (!keys.length)  return errorMsg();

    const ans = {};
    keys.forEach(key => {
        ans[key] = getType(obj[key], firstKey);
    });
    return PropTypes.shape(ans).isRequired;
}

function propTyper(obj, actions = false) {
    return Object.keys(obj)
        .reduce((acc, key) => {
            acc[key] = getType(obj[key], key, actions);
            return acc;
        }, {});
}

export default propTyper;
