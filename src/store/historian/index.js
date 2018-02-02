import { diff, diffBackwards, diffForwards } from './diff';

function addCan(history) {
    const helper = (arr, i, direction) => {
        i += direction;
        if (i < 0) return false;
        if (i >= arr.length) return false;
        if (arr[i].skip) return helper(arr, i, direction);
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
    tempSkips: [],
    temp: null,
    can: {
        forwards: false,
        backwards: false
    }
};

export { defaultValues };
export default function history({ key, exclude }) {
    if (!exclude) exclude = [];

    function insert(previous, updated, skip = false) {
        if (previous[key].temp) {
            return insert(previous[key].temp, updated);
        }

        const diffObj = diff(previous, updated, exclude.concat(key));
        if (!diffObj) return previous;

        const history = previous[key];

        if (skip) {
            return {
                ...updated,
                [key]: {
                    ...history,
                    tempSkips: history.tempSkips
                        .concat([{ diff: diffObj, skip: true }])
                }
            };
        }

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
                    .concat(history.tempSkips)
                    .concat([{ diff: diffObj, skip }]),
                tempSkips: [],
                temp: null
            })
        };
    }

    function tempInsert(previous, updated) {
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
        if (!history.tempSkips.length) return current;

        const updated = diffBackwards(
            current,
            history.tempSkips.slice(-1)[0].diff
        );

        updated[key] = {
            ...history,
            tempSkips: history.tempSkips.slice(0, -1)
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
            tempSkips: [],
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
            tempSkips: [],
            index: history.index + 1
        });
        return (selected.skip)
            ? forwards(updated)
            : updated;
    }

    return {
        key,
        insert,
        tempInsert,
        backwards,
        forwards
    };
}
