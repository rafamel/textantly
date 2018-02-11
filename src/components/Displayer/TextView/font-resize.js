function setSize(size) {
  this.nodes.text.style.fontSize = `${size}px`;
  this.current.fontSize = size;
}

function setPhase(phase) {
  this.current.phase = phase;
  this.current.up = null;
}

function getDimensions() {
  const nodes = this.nodes;
  if (!nodes.outer || !nodes.inner) return;
  const dimensions = {
    outer: {
      width: nodes.outer.clientWidth + 1,
      height: nodes.outer.clientHeight + 1
    },
    inner: {
      width: nodes.inner.clientWidth,
      height: nodes.inner.clientHeight
    }
  };
  const anyEmpty =
    (!dimensions.inner.width && !dimensions.inner.height) ||
    dimensions.outer.width <= 1 ||
    dimensions.outer.height <= 1;
  if (anyEmpty) return;

  return dimensions;
}

function resize(dimensions, goingUp) {
  const { phase, fontSize: currentSize } = this.current;

  const phase1 = () => {
    const alpha = 0.2;
    const diff =
      alpha *
      0.5 *
      (Math.abs(dimensions.outer.width - dimensions.inner.width) +
        Math.abs(dimensions.outer.height - dimensions.inner.height));

    if (diff < 1) {
      setPhase.call(this, 2);
      return phase2();
    }
    return Math.max(minSize, currentSize + (goingUp ? diff : -diff));
  };
  const phase2 = () => Math.max(minSize, currentSize + (goingUp ? 1 : -1));

  const size = phase === 1 ? phase1() : phase2();
  setSize.call(this, Math.round(size));
  return size;
}

function fontResize(ongoing) {
  const next = () => {
    if (this.current.phase === 2) {
      setPhase.call(this, 0);
      if (this.current.stack) {
        this.current.stack = false;
        fontResize.call(this);
      }
    } else {
      setPhase.call(this, 2);
      fontResize.call(this, true);
    }
  };

  if (this.current.phase && !ongoing) {
    this.current.stack = true;
    return;
  }

  const dimensions = getDimensions.call(this);
  if (!dimensions) return setPhase.call(this, 0);

  if (!this.current.phase) setPhase.call(this, 1);
  const goingUp = this.current.up;
  const { outer, inner } = dimensions;
  if (inner.height > outer.height || inner.width > outer.width) {
    const size = resize.call(this, dimensions, false);
    if (goingUp === null || goingUp === false) {
      this.current.up = false;
      if (size > minSize) fontResize.call(this, true);
      else next();
    } else {
      next();
    }
  } else {
    if (goingUp === null || goingUp === true) {
      this.current.up = true;
      resize.call(this, dimensions, true);
      fontResize.call(this, true);
    } else {
      next();
    }
  }
}

const minSize = 1;
export { fontResize as default, setPhase };
