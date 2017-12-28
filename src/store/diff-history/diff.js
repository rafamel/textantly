import deepDiff from 'deep-diff';
import deep from 'lodash.clonedeep';

export function diff(previous, updated, key) {
    return deepDiff.diff(previous, updated, function (_, diffKey) {
        // Filter history key
        return diffKey === key;
    });
};

export function diffForwards(from, diffObj) {
    const ans = deep(from);
    diffObj.forEach(singleDiff => {
        deepDiff.applyChange(ans, {}, singleDiff);
    });
    return ans;
};

export function diffBackwards(from, diffObj) {
    const ans = deep(from);
    diffObj.forEach(singleDiff => {
        deepDiff.revertChange(ans, {}, singleDiff);
    });
    return ans;
};
