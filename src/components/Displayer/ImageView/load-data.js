import engine from 'engine';
import { cropForRatio } from 'engine/crop';
import isEqual from 'lodash.isequal';

function crop() {
  const props = this.lastProps;
  const canvasData = this.cropper.getCanvasData();
  const canvasVisible = this.data.canvas.visible;

  const crop = props.operations.crop;
  const limitedCrop = {
    ratio: crop.ratio,
    width: {
      start: Math.max(crop.width.start, canvasVisible.width.start),
      end: Math.min(crop.width.end, canvasVisible.width.end)
    },
    height: {
      start: Math.max(crop.height.start, canvasVisible.height.start),
      end: Math.min(crop.height.end, canvasVisible.height.end)
    }
  };
  if (limitedCrop.width.end - limitedCrop.width.start < 0) {
    limitedCrop.width = { ...canvasVisible.width };
  }
  if (limitedCrop.height.end - limitedCrop.height.start < 0) {
    limitedCrop.height = { ...canvasVisible.height };
  }

  const cropped = cropForRatio(
    { width: canvasData.width, height: canvasData.height },
    limitedCrop
  );
  const { width, height } = cropped.crop;

  if (width.start > 0 || width.end < 1 || height.start > 0 || height.end < 1) {
    this.setState({ activeCrop: true });
  } else {
    this.setState({ activeCrop: false });
  }

  const toLoad = {
    left: width.start * canvasData.width + canvasData.left,
    top: height.start * canvasData.height + canvasData.top,
    width: cropped.dimensions.width,
    height: cropped.dimensions.height
  };

  this.cropper.setCropBoxData(toLoad);
  if (!isEqual(crop, limitedCrop)) this.save.crop();
}

function data() {
  const props = this.lastProps;

  if (!props.isMobile || props.viewMode) viewModeCanvas.call(this);
  else cropViewCanvas.call(this);
  crop.call(this);
}

function viewModeCanvas() {
  const props = this.lastProps;
  const fitTo = props.fitTo;
  const ratio = props.operations.resize.ratio;
  const maxDrawn = this.data.maxDrawn;

  const dimensions = engine.getDimensions(
    { width: maxDrawn.width * ratio, height: maxDrawn.height * ratio },
    { fit: fitTo }
  );
  const toLoad = {
    left: (fitTo.width - dimensions.width) / 2,
    top: (fitTo.height - dimensions.height) / 2,
    width: dimensions.width,
    height: dimensions.height
  };
  if (!toLoad.width || !toLoad.height) return;

  this.cropper.setCanvasData(toLoad);
}

function cropViewCanvas() {
  const props = this.lastProps;
  const fitTo = props.fitTo;
  const maxDrawn = this.data.maxDrawn;
  const {
    dimensions,
    position,
    visible,
    forFit,
    forMaxDrawn,
    forRatio
  } = this.data.canvas;

  const getToCalculate = () => {
    const A = 5; // Alpha in px

    const isAdjusted = () =>
      Math.abs(dimensions.height - forFit.height) <= A ||
      Math.abs(dimensions.width - forFit.width) <= A ||
      Math.abs(dimensions.width - forMaxDrawn.width * forRatio) <= A;
    if (
      !dimensions ||
      !position ||
      !forFit ||
      !forMaxDrawn ||
      !forRatio ||
      isAdjusted()
    ) {
      const ratio = props.operations.resize.ratio;
      return {
        width: maxDrawn.width * ratio,
        height: maxDrawn.height * ratio
      };
    }

    const initialDims = {
      // Width:Height ratio could have changed
      width: dimensions.width * maxDrawn.width / forMaxDrawn.width,
      height: dimensions.height * maxDrawn.height / forMaxDrawn.height
    };

    if (isEqual(forFit, fitTo)) return initialDims;

    const getBoth = (name, opposite) => {
      const a = initialDims[name] + (fitTo[name] - forFit[name]);
      const b = initialDims[opposite] * a / initialDims[name];
      return [a, b];
    };
    const arr = [initialDims];
    if (forFit.width !== fitTo.width) {
      const forWidth = getBoth('width', 'height');
      arr.push({
        width: forWidth[0],
        height: forWidth[1]
      });
    }
    if (forFit.height !== fitTo.height) {
      const forHeight = getBoth('height', 'width');
      arr.push({
        height: forHeight[0],
        width: forHeight[1]
      });
    }

    return arr.reduce(
      (acc, x) => {
        return acc.width > x.width ? acc : x;
      },
      { width: 0, height: 0 }
    );
  };

  const toCalculate = getToCalculate();

  const diffPxForCalc = {
    width: (visible.width.end - visible.width.start) * toCalculate.width,
    height: (visible.height.end - visible.height.start) * toCalculate.height
  };
  const visibleDims = engine.getDimensions(diffPxForCalc, { fit: fitTo });

  const toLoad = {
    width: toCalculate.width * visibleDims.width / diffPxForCalc.width,
    height: toCalculate.height * visibleDims.height / diffPxForCalc.height
  };

  toLoad.left = position.x * fitTo.width - toLoad.width / 2;
  toLoad.top = position.y * fitTo.height - toLoad.height / 2;

  const ends = {
    width: (1 - visible.width.end) * toLoad.width,
    height: (1 - visible.height.end) * toLoad.height
  };

  toLoad.left = Math.min(
    fitTo.width - (toLoad.width - ends.width),
    Math.max(toLoad.left, -visible.width.start * toLoad.width)
  );
  toLoad.top = Math.min(
    fitTo.height - (toLoad.height - ends.height),
    Math.max(toLoad.top, -visible.height.start * toLoad.height)
  );

  this.cropper.setCanvasData(toLoad);
}

export { crop, data };
