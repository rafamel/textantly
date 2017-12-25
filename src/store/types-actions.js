function cleanType(type) {
    return type
        .toUpperCase()
        .replace(/ /g, '_')
        .replace(/^_*/, '')
        .replace(/_*$/, '')
        .replace(/_{2,}/, '_');
}

function createTypes({ pre: prefix, types: typesArr }) {
    const cleanTypesArr = typesArr.map(cleanType);
    const duplicates = cleanTypesArr
        .filter((x, i, arr) => arr.lastIndexOf(x) !== i)
        .length
    if (duplicates) {
        throw Error(`There is a duplicate type for ${prefix}`);
    }
    prefix = prefix.toUpperCase().replace(/ /g, '_');
    const ans = {};
    typesArr.forEach((type, i) => {
        ans[type] = `${prefix}_${cleanTypesArr[i]}`;
    });
    return ans;
}

function createActions(types) {
    const ans = {};
    Object.keys(types).forEach(key => {
        let fnKey = '';
        const cleanKey = cleanType(key);
        for (let i = 0; i < cleanKey.length; i++) {
            if (cleanKey[i] === '_' && cleanKey.length - 1 >= i + 1) {
                fnKey += cleanKey[i+1].toUpperCase();
                i++;
            } else {
                fnKey += cleanKey[i].toLowerCase();
            }
        }
        ans[fnKey] = (payload) => ({
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
