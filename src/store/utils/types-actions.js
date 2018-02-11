import values from 'lodash.values';

function cleanType(type) {
  return type
    .toUpperCase()
    .replace(/ /g, '_')
    .replace(/^_*/, '')
    .replace(/_*$/, '')
    .replace(/_{2,}/, '_');
}

function checkDuplicates(arr, id) {
  const duplicates = arr.filter((x, i) => arr.lastIndexOf(x) !== i).length;
  if (duplicates) throw Error(`There is a duplicate type for ${id}`);
}

function typesPostfix({ post: postfixes, types }, includeAll = true) {
  if (!Array.isArray(postfixes)) postfixes = [postfixes];
  const cleanPostfixes = postfixes.map((x) => {
    x = cleanType(x);
    if (x === 'BASE') throw Error(`Postfix can't be 'BASE'`);
    return x;
  });
  checkDuplicates(postfixes, 'postfixes');
  const flat = includeAll ? { ...types } : {};
  const byType = {};
  const byPost = postfixes.reduce((acc, x) => {
    acc[x] = {};
    return acc;
  }, {});
  Object.keys(types).forEach((key) => {
    const base = types[key];
    byType[key] = includeAll ? { BASE: base } : {};
    postfixes.forEach((post, i) => {
      const value = `${base}_${cleanPostfixes[i]}`;
      flat[`${key}_${post}`] = value;
      byType[key][post] = value;
      byPost[post][key] = value;
    });
  });
  return {
    all: flat,
    type: byType,
    post: byPost
  };
}

function createTypes(
  { pre: prefix, types: typesArr, post: postfixes },
  includeAll
) {
  const cleanTypesArr = typesArr.map(cleanType);
  checkDuplicates(cleanTypesArr, prefix);
  prefix = prefix.toUpperCase().replace(/ /g, '_');
  const ans = { types: {} };
  typesArr.forEach((type, i) => {
    ans.types[type] = prefix
      ? `${prefix}_${cleanTypesArr[i]}`
      : cleanTypesArr[i];
  });
  if (postfixes) {
    ans.typesBy = typesPostfix(
      { types: ans.types, post: postfixes },
      includeAll
    );
    ans.types = ans.typesBy.all;
  }
  return ans;
}

function createActions(types) {
  const ans = {};
  Object.keys(types).forEach((key) => {
    let fnKey = '';
    const cleanKey = cleanType(key);
    for (let i = 0; i < cleanKey.length; i++) {
      if (cleanKey[i] === '_' && cleanKey.length - 1 >= i + 1) {
        fnKey += cleanKey[i + 1].toUpperCase();
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

function typesActions({ pre, types, post }, includeAll) {
  const ans = createTypes({ pre, types, post }, includeAll);
  ans.actions = createActions(ans.types);
  return ans;
}

const typeInTypes = (type) => (types) => {
  return values(types).includes(type);
};

export {
  typesActions as default,
  createTypes,
  createActions,
  typeInTypes,
  values
};
