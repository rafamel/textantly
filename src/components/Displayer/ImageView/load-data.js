import engine from 'engine';
import isEqual from 'lodash.isequal';

function crop(containerData) {
    console.log('crop load');

    if (!containerData) containerData = this.cropper.getContainerData();
    const canvasData = this.cropper.getCanvasData();

    const getMax = (offset, length, containerLength) => {
        const excess = containerLength - (offset + length);

        let ans = 1;
        if (offset < 0) ans += (offset / length);
        if (excess < 0) ans += (excess / length);
        return ans;
    };
    const max = {
        width: getMax(canvasData.left, canvasData.width, containerData.width),
        height: getMax(canvasData.top, canvasData.height, containerData.height)
    };
    const values = {
        ...this.data.crop,
        width: Math.min(this.data.crop.width, max.width),
        height: Math.min(this.data.crop.height, max.height)
    };

    const toLoad = {
        left: canvasData.left
            + (canvasData.width * values.left),
        top: canvasData.top
            + (canvasData.height * values.top),
        width: canvasData.width * values.width,
        height: canvasData.height * values.height
    };
    this.cropper.setCropBoxData(toLoad);
}

function data(props = this.props) {
    console.log('canvas load');

    const fitTo = props.dimensions;
    const {
        dimensions,
        position,
        forFit,
        visible,
        forMaxDrawn
    } = this.data.canvas;

    const getToCalculate = () => {
        const A = 5; // Alpha in px

        const isAdjusted = () => isEqual(position, { x: 0.5, y: 0.5 })
            && (
                Math.abs(dimensions.height - forFit.height) <= A
                || Math.abs(dimensions.width - forFit.width) <= A
            );
        if (
            !dimensions
            || !position
            || !forFit
            || Math.abs(dimensions.width - forMaxDrawn.width) <= A
            || isAdjusted()
        ) {
            return this.data.maxDrawn;
        }

        const initialDims = {
            // Width:Height ratio could have changed
            width: (dimensions.width * this.data.maxDrawn.width)
                / forMaxDrawn.width,
            height: (dimensions.height * this.data.maxDrawn.height)
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
    crop.call(this, fitTo);
}

export { crop, data };
