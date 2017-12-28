import { diff, diffBackwards, diffForwards } from './diff';

function addCan(history) {
    const { index, arr } = history;
    const can = {};
    if (!arr.length) {
        can.forwards = false;
        can.backwards = false;
    } else if (index === -1 || index > arr.length - 1) {
        can.forwards = false;
        can.backwards = true;
    } else if (index === 0) {
        can.forwards = true;
        can.backwards = false;
    } else {
        can.forwards = true;
        can.backwards = true;
    }
    history.can = can;
    return history;
}

const defaultHistoryValues = {
    index: -1,
    arr: [],
    can: {
        forwards: false,
        backwards: false
    }
};

export { defaultHistoryValues };

export default function (key) {
    function insert(previous, updated) {
        const diffObj = diff(previous, updated, key);
        if (!diffObj) return previous;

        const currentHistory = previous[key];
        const index = currentHistory.index;
        const arr = (index === -1)
            ? currentHistory.arr
            : currentHistory.arr.slice(0, index);
        updated[key] = addCan({
            index: -1,
            arr: arr.concat([diffObj])
        });
        return updated;
    }

    function backwards(current) {
        const history = current[key];
        if (!history || !history.can.backwards) return current;

        const select = (history.index === -1)
            ? history.arr.length - 1
            : history.index - 1;

        const updated = diffBackwards(current, history.arr[select]);
        updated[key] = addCan({
            index: select,
            arr: history.arr
        });
        return updated;
    }

    function forwards(current) {
        const history = current[key];
        if (!history || !history.can.forwards) return current;

        const updated = diffForwards(current, history.arr[history.index]);
        updated[key] = addCan({
            index: history.index + 1,
            arr: history.arr
        });
        return updated;
    }

    return {
        insert,
        backwards,
        forwards
    };
}
