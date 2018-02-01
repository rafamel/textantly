function maxDrawn(props = this.props) {
    const imageData = this.cropper.getImageData();
    const canvasData = this.cropper.getCanvasData();
    const source = props.sourceDimensions;

    this.data.maxDrawn = {
        width: (source.width * canvasData.naturalWidth)
            / imageData.naturalWidth,
        height: (source.height * canvasData.naturalHeight)
            / imageData.naturalHeight
    };
}

function resetCanvas() {
    this.data.canvas = {
        position: { x: 0.5, y: 0.5 },
        visible: {
            width: { start: 0, end: 1 },
            height: { start: 0, end: 1 }
        }
    };
}

function canvas(props = this.props) {
    const containerData = props.fitTo;
    const canvasData = this.cropper.getCanvasData();

    const A = 4; // Alpha in px
    const getOffset = (x) => (Math.abs(x) <= A) ? 0 : x;
    const offset = {
        left: getOffset(canvasData.left),
        top: getOffset(canvasData.top),
        right: getOffset(
            containerData.width - (canvasData.left + canvasData.width)
        ),
        bottom: getOffset(
            containerData.height - (canvasData.top + canvasData.height)
        )
    };

    const canvas = {};
    canvas.forFit = containerData;
    canvas.forMaxDrawn = { ...this.data.maxDrawn };
    canvas.forRatio = props.operations.resize.ratio;

    canvas.dimensions = {
        width: canvasData.width,
        height: canvasData.height
    };

    canvas.position = {
        x: (offset.left + (canvasData.width / 2))
            / containerData.width,
        y: (offset.top + (canvasData.height / 2))
            / containerData.height
    };

    canvas.visible = {
        width: {
            start: (offset.left < 0)
                ? -(offset.left / canvasData.width)
                : 0,
            end: (offset.right < 0)
                ? 1 + (offset.right / canvasData.width)
                : 1
        },
        height: {
            start: (offset.top < 0)
                ? -(offset.top / canvasData.height)
                : 0,
            end: (offset.bottom < 0)
                ? 1 + (offset.bottom / canvasData.height)
                : 1
        }
    };

    const alpha = 0.01;
    let reload = false;
    if (
        (1 - canvas.visible.width.start) < alpha
        || (1 - canvas.visible.height.start) < alpha
        || canvas.visible.width.end < alpha
        || canvas.visible.height.end < alpha
    ) {
        reload = true;
        canvas.position = { x: 0.5, y: 0.5 };
        canvas.visible = {
            width: { start: 0, end: 1 },
            height: { start: 0, end: 1 }
        };
        this.data.crop = {
            width: { start: 0, end: 1 },
            height: { start: 0, end: 1 }
        };
    }

    this.data.canvas = canvas;
    if (reload) this.load.data();
}

function crop(props = this.props) {
    const cropBoxData = this.cropper.getCropBoxData();
    const canvasData = this.cropper.getCanvasData();

    const A = 0.01; // Alpha for ratio

    const canvasRelative = {
        left: cropBoxData.left - canvasData.left,
        top: cropBoxData.top - canvasData.top
    };

    const approximate = (approximateN, value) => {
        if (!value) return 0;
        return (Math.abs(approximateN - value) <= A)
            ? approximateN
            : value;
    };

    let values = {
        width: {
            start: approximate(0, canvasRelative.left / canvasData.width),
            end: approximate(1,
                (canvasRelative.left + cropBoxData.width) / canvasData.width
            )
        },
        height: {
            start: approximate(0, canvasRelative.top / canvasData.height),
            end: approximate(1,
                (canvasRelative.top + cropBoxData.height) / canvasData.height
            )
        }
    };

    let reload = false;
    if (values.width.start >= 1 || values.width.end <= 0
        || values.height.start >= 1 || values.height.end <= 0) {
        reload = true;
        values = {
            width: { start: 0, end: 1 },
            height: { start: 0, end: 1 }
        };
    } else {
        if ((values.width.end - values.width.start) < A) {
            reload = true;
            values.width = { start: 0, end: 1 };
        }
        if ((values.height.end - values.height.start) < A) {
            reload = true;
            values.height = { start: 0, end: 1 };
        }
    }

    this.data.crop = values;
    if (reload) this.load.crop();
}

export { maxDrawn, resetCanvas, canvas, crop };
