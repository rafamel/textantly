import engine from 'engine';
import isEqual from 'lodash.isequal';

function crop(props = this.props) {
    const fitTo = props.fitTo;
    const canvasData = this.cropper.getCanvasData();
    const { width, height } = this.data.crop;

    const toLoad = {
        left: (width.start * canvasData.width) + canvasData.left,
        top: (height.start * canvasData.height) + canvasData.top,
        width: (width.end - width.start) * canvasData.width,
        height: (height.end - height.start) * canvasData.height
    };

    if (props.viewMode) {
        const previous = { ...toLoad };
        toLoad.left = Math.max(canvasData.left, toLoad.left);
        toLoad.top = Math.max(canvasData.top, toLoad.top);

        if (toLoad.left !== previous.left) {
            toLoad.width += previous.left - toLoad.left;
        }
        if (toLoad.top !== previous.top) {
            toLoad.height += previous.top - toLoad.top;
        }

        toLoad.width = Math.min(
            toLoad.width,
            canvasData.left + canvasData.width - toLoad.left
        );
        toLoad.height = Math.min(
            toLoad.height,
            canvasData.top + canvasData.height - toLoad.top
        );
    } else {
        if (toLoad.left < 0) toLoad.width += toLoad.left;
        const wDiff = fitTo.width - (toLoad.left + toLoad.width);
        if (wDiff < 0) {
            toLoad.width += wDiff;
            toLoad.left -= wDiff;
        }

        if (toLoad.top < 0) toLoad.height += toLoad.top;
        const hDiff = fitTo.height - (toLoad.top + toLoad.height);
        if (hDiff < 0) {
            toLoad.height += hDiff;
            toLoad.top -= hDiff;
        }
    }

    this.cropper.setCropBoxData(toLoad);
}

function data(props = this.props) {
    if (!props.isMobile || props.viewMode) viewModeCanvas.call(this, props);
    else cropViewCanvas.call(this, props);

    crop.call(this, props);
}

function viewModeCanvas(props) {
    const { fitTo } = props;
    const maxDrawn = this.data.maxDrawn;
    const ratio = props.operations.resize.ratio;

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

function cropViewCanvas(props) {
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

        const isAdjusted = () => (
            Math.abs(dimensions.height - forFit.height) <= A
            || Math.abs(dimensions.width - forFit.width) <= A
            || Math.abs(dimensions.width - (forMaxDrawn.width * forRatio)) <= A
        );
        if (
            !dimensions
            || !position
            || !forFit
            || !forMaxDrawn
            || !forRatio
            || isAdjusted()
        ) {
            const ratio = props.operations.resize.ratio;
            return {
                width: maxDrawn.width * ratio,
                height: maxDrawn.height * ratio
            };
        }

        const initialDims = {
            // Width:Height ratio could have changed
            width: (dimensions.width * maxDrawn.width)
                / forMaxDrawn.width,
            height: (dimensions.height * maxDrawn.height)
                / forMaxDrawn.height
        };

        if (isEqual(forFit, fitTo)) return initialDims;

        const getBoth = (name, opposite) => {
            const a = initialDims[name] + (fitTo[name] - forFit[name]);
            const b = (initialDims[opposite] * a) / initialDims[name];
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

        return arr.reduce((acc, x) => {
            return (acc.width > x.width) ? acc : x;
        }, { width: 0, height: 0 });
    };

    const toCalculate = getToCalculate();

    const diffPxForCalc = {
        width: (visible.width.end - visible.width.start) * toCalculate.width,
        height: (visible.height.end - visible.height.start) * toCalculate.height
    };
    const visibleDims = engine.getDimensions(diffPxForCalc, { fit: fitTo });

    const toLoad = {
        width: (toCalculate.width * visibleDims.width) / diffPxForCalc.width,
        height: (toCalculate.height * visibleDims.height) / diffPxForCalc.height
    };

    toLoad.left = (position.x * fitTo.width) - (toLoad.width / 2);
    toLoad.top = (position.y * fitTo.height) - (toLoad.height / 2);

    const ends = {
        width: (1 - visible.width.end) * toLoad.width,
        height: (1 - visible.height.end) * toLoad.height
    };

    toLoad.left = Math.min(
        fitTo.width - (toLoad.width - ends.width),
        Math.max(
            toLoad.left,
            -visible.width.start * toLoad.width
        )
    );
    toLoad.top = Math.min(
        fitTo.height - (toLoad.height - ends.height),
        Math.max(
            toLoad.top,
            -visible.height.start * toLoad.height
        )
    );

    this.cropper.setCanvasData(toLoad);
}

export { crop, data };
