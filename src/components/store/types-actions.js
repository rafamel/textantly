function createTypes({ pre: prefix, types: typesArr }) {
    const duplicates = typesArr
        .map(x => x.toLowerCase())
        .filter((x, i, arr) => arr.lastIndexOf(x) !== i)
        .length
    if (duplicates) {
        throw Error(`There is a duplicate type for ${prefix}`);
    }
    prefix = prefix.toUpperCase();
    const ans = {};
    typesArr.forEach(type => {
        type = type.toUpperCase();
        ans[type] = `${prefix}_${type}`;
    });
    return ans;
}

function createActions(types) {
    const ans = {};
    Object.keys(types).forEach(key => {
        ans[key.toLowerCase()] = (payload) => ({
            type: types[key],
            payload
        });
    });
    return ans;
}

function typesActions(obj) {
    const types = createTypes(obj);
    const actions = createActions(types);
    return {
        types,
        actions
    };
}

export {
    typesActions as default,
    createTypes
}
