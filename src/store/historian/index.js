import { diff, diffBackwards, diffForwards } from './diff';

function addCan(history) {
    const helper = (arr, i, direction) => {
        i += direction;
        if (i < 0) return false;
        if (i >= arr.length) return false;
        if (arr[i].onNext) return helper(arr, i, direction);
        return true;
    };

    const { index, arr, temp } = history;
    const i = (index === -1) ? arr.length : index;
    const can = {
        backwards: helper(arr, i, -1),
        forwards: (temp)
            ? false
            : helper(arr, i - 1, +1)
    };

    history.can = can;
    return history;
}

const defaultValues = {
    index: -1,
    arr: [],
    onNextArr: [],
    temp: null,
    consolidateNext: null,
    can: {
        forwards: false,
        backwards: false
    }
};

export { defaultValues };
export default function history({ key, exclude }) {
    if (!exclude) exclude = [].concat(key);

    function insert(previous, updated) {
        if (previous[key].temp) {
            return insert(previous[key].temp, updated);
        }

        const diffObj = diff(previous, updated, exclude);
        if (!diffObj) return previous;

        const history = previous[key];

        const index = history.index;
        const arr = (index === -1)
            ? history.arr
            : history.arr.slice(0, index);
        return {
            ...updated,
            [key]: addCan({
                ...history,
                index: -1,
                arr: arr
                    .concat(history.onNextArr)
                    .concat({ diff: diffObj, onNext: false, skip: false }),
                onNextArr: [],
                temp: null
            })
        };
    }

    function insertNext(previous, updated, skip = false) {
        if (previous[key].temp) {
            return insertNext(previous[key].temp, updated);
        }

        const diffObj = diff(previous, updated, exclude);
        if (!diffObj) return previous;

        return {
            ...updated,
            [key]: {
                ...previous[key],
                onNextArr: previous[key].onNextArr
                    .concat([{ diff: diffObj, onNext: true, skip }])
            }
        };
    }

    function insertTemp(previous, updated) {
        const history = previous[key];
        return (history.temp)
            ? {
                ...updated,
                [key]: history
            } : {
                ...updated,
                [key]: addCan({ ...history, temp: previous })
            };
    }

    function undoSkips(current) {
        const history = current[key];
        if (!history.onNextArr.length) return current;

        const selected = history.onNextArr.slice(-1)[0];
        if (!selected.skip) return current;

        const updated = diffBackwards(current, selected.diff);

        updated[key] = {
            ...history,
            onNextArr: history.onNextArr.slice(0, -1)
        };
        return undoSkips(updated);
    }

    function backwards(current) {
        const history = current[key];
        if (!history || !history.can.backwards) return current;
        if (history.temp) return history.temp;
        current = undoSkips(current);

        const select = (history.index === -1)
            ? history.arr.length - 1
            : history.index - 1;
        const selected = history.arr[select];

        const updated = diffBackwards(current, selected.diff);
        updated[key] = addCan({
            ...history,
            onNextArr: [],
            index: select
        });
        return (selected.skip)
            ? backwards(updated)
            : updated;
    }

    function forwards(current) {
        const history = current[key];
        if (!history || !history.can.forwards || history.temp) return current;
        current = undoSkips(current);

        const selected = history.arr[history.index];
        const updated = diffForwards(current, selected.diff);
        updated[key] = addCan({
            ...history,
            onNextArr: [],
            index: history.index + 1
        });
        return (selected.skip)
            ? forwards(updated)
            : updated;
    }

    return {
        key,
        insert,
        insertNext,
        insertTemp,
        backwards,
        forwards
    };
}
