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

function canvas(props = this.props) {
    console.log('canvas save');

    const containerData = this.cropper.getContainerData();
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

    this.data.canvas = canvas;
}

function crop(props = this.props) {
    console.log('crop save');

    const cropBoxData = this.cropper.getCropBoxData();
    const canvasData = this.cropper.getCanvasData();

    const A = 0.01; // Alpha for ratio
    const cropCalc = (approximateN, value) => {
        if (!value) return 0;
        return (Math.abs(approximateN - value) <= A)
            ? approximateN
            : value;
    };
    const values = {
        left: cropCalc(0,
            (cropBoxData.left - canvasData.left) / canvasData.width),
        top: cropCalc(0,
            (cropBoxData.top - canvasData.top) / canvasData.height),
        width: cropCalc(1, (cropBoxData.width / canvasData.width)),
        height: cropCalc(1, (cropBoxData.height / canvasData.height))
    };

    if (values.left + values.width < 0 || values.left > 1
        || values.top + values.height < 0 || values.top > 1) {
        this.data.crop = {
            top: 0,
            left: 0,
            width: 1,
            height: 1
        };
        return;
    }

    const ans = {};
    ans.left = Math.min(Math.max(values.left, 0), 1);
    if (ans.left !== values.left) values.width -= (ans.left - values.left);
    ans.width = Math.min(values.width, 1 - ans.left);

    ans.top = Math.min(Math.max(values.top, 0), 1);
    if (ans.top !== values.top) values.height -= (ans.top - values.top);
    ans.height = Math.min(values.height, 1 - ans.top);

    if (ans.width <= A) {
        ans.left = 0;
        ans.width = 1;
    }
    if (ans.height <= A) {
        ans.top = 0;
        ans.height = 1;
    }

    this.data.crop = ans;
}

export { maxDrawn, canvas, crop };
