import { diff, diffBackwards, diffForwards } from './diff';

function addCan(history) {
    const { index, arr, temp } = history;
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
    if (temp) can.forwards = false;
    history.can = can;
    return history;
}

const defaultValues = {
    index: -1,
    arr: [],
    temp: null,
    checkpoint: null,
    can: {
        forwards: false,
        backwards: false
    }
};

export { defaultValues };
export default function history({ key, exclude }) {
    if (!exclude) exclude = [];

    function insert(previous, updated) {
        if (previous[key].temp) {
            return insert(previous[key].temp, updated);
        }

        const diffObj = diff(previous, updated, exclude.concat(key));
        if (!diffObj) return previous;

        const history = previous[key];
        if (!history.arr.length) {
            history.checkpoint = previous;
        }
        const index = history.index;
        const arr = (index === -1)
            ? history.arr
            : history.arr.slice(0, index);
        updated[key] = addCan({
            ...history,
            index: -1,
            arr: arr.concat([diffObj]),
            temp: null
        });
        return updated;
    }

    function tempInsert(previous, updated) {
        const history = previous[key];
        if (history.temp) {
            updated[key] = history;
        } else {
            updated[key] = addCan({
                ...history,
                temp: previous
            });
        }
        return updated;
    }

    function tempForget(current) {
        const history = current[key];
        if (history.temp) return history.temp;
        return current;
    }

    function checkpoint(current) {
        current[key] = {
            ...current[key],
            checkpoint: current
        };
        return current;
    }

    function restoreCheckpoint(current) {
        const history = current[key];
        if (!history.checkpoint) return current;
        return insert(current, history.checkpoint);
    }

    function backwards(current) {
        const history = current[key];
        if (!history || !history.can.backwards) return current;
        if (history.temp) return history.temp;

        const select = (history.index === -1)
            ? history.arr.length - 1
            : history.index - 1;

        const updated = diffBackwards(current, history.arr[select]);
        updated[key] = addCan({
            ...history,
            index: select
        });
        return updated;
    }

    function forwards(current) {
        const history = current[key];
        if (!history || !history.can.forwards || history.temp) return current;

        const updated = diffForwards(current, history.arr[history.index]);
        updated[key] = addCan({
            ...history,
            index: history.index + 1
        });
        return updated;
    }

    return {
        key,
        insert,
        tempInsert,
        tempForget,
        checkpoint,
        restoreCheckpoint,
        backwards,
        forwards
    };
}
