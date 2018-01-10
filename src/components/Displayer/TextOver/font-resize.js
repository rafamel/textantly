import isEqual from 'lodash.isequal';

function getDimensions() {
    const nodes = this.nodes;
    if (!nodes.parent || !nodes.child) return;
    const dimensions = {
        parent: {
            width: nodes.parent.clientWidth + 1,
            height: nodes.parent.clientHeight + 1
        },
        child: {
            width: nodes.child.clientWidth,
            height: nodes.child.clientHeight
        }
    };
    const anyEmpty = !dimensions.child.width || !dimensions.child.height
        || dimensions.parent.width <= 1 || dimensions.parent.height <= 1;
    if (anyEmpty) return;

    return dimensions;
}

function setInitState(phase = 1) {
    state = {
        lock: true,
        phase: phase,
        up: null,
        ranFor: false,
        queued: false,
        endOnNext: false
    };
}

function setEndState(dimensions) {
    state = {
        lock: false,
        phase: 1,
        up: null,
        ranFor: dimensions,
        queued: state.queued,
        endOnNext: false
    };
}

function newFontSize(dimensions) {
    const currentSize = this.state.fontSize;
    const sizePhase2 = () => currentSize + ((state.up) ? 1 : -1);
    if (state.phase === 2) return sizePhase2();
    else {
        const alpha = 0.1;
        const diff = alpha * Math.min(
            Math.abs(dimensions.parent.width - dimensions.child.width),
            Math.abs(dimensions.parent.height - dimensions.child.height)
        );
        if (diff < 1) {
            setInitState(2);
            state.lock = false;
            return sizePhase2();
        }
        return currentSize + ((state.up) ? diff : -diff);
    }
}

function runResize(dimensions) {
    const initPhase2 = () => {
        setInitState(2);
        return runResize.call(this, dimensions);
    };
    const { parent, child } = dimensions;
    if (child.width > parent.width || child.height > parent.height) {
        if (state.up) {
            if (state.phase === 2) state.endOnNext = true;
            else return initPhase2();
        }
        state.up = false;
        state.lock = false;
        this.setState({ fontSize: newFontSize.call(this, dimensions) });
    } else {
        if (state.up === false) {
            if (state.phase === 2) setEndState(dimensions);
            else initPhase2();
        } else {
            state.up = true;
            state.lock = false;
            this.setState({ fontSize: newFontSize.call(this, dimensions) });
        }
    }
}

let state;
export default function fontResize() {
    if (!Object.keys(this.nodes).length) return;
    if (!state) setInitState();
    else if (state.lock) {
        state.queued = true;
        return;
    }

    const dimensions = getDimensions.call(this);
    if (!dimensions) {
        state.lock = false;
        setTimeout(() => { fontResize.call(this); }, 250);
        return;
    }

    if (state.ranFor && isEqual(state.ranFor, dimensions)) {
        if (!state.queued) {
            state.lock = false;
            return;
        }
        setInitState();
    }
    if (state.endOnNext) {
        setEndState(dimensions);
        if (!state.queued) return;
        else state.lock = true;
    }

    return runResize.call(this, dimensions);
}
