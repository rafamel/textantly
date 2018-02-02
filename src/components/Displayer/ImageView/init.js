import isEqual from 'lodash.isequal';

function up() {
    const props = this.lastProps;
    // Prepare
    this.loading = true;
    this.setState({ hidden: true });

    // Populate clean data
    this.operations = {};
    this.data = {
        maxDrawn: { width: 0, height: 0 },
        canvas: {
            position: { x: 0.5, y: 0.5 },
            visible: {
                width: { start: 0, end: 1 },
                height: { start: 0, end: 1 }
            }
        }
    };

    const crop = props.operations.crop;
    const activeCrop = crop.ratio
        || crop.width.start > 0
        || crop.width.end < 1
        || crop.height.start > 0
        || crop.height.end < 1;
    this.setState({ activeCrop });
    this.activeCropbox = !props.viewMode || activeCrop;

    if (this._isMounted && this.activeCropbox) {
        this.cropper.setAspectRatio(crop.ratio);
    }
    this.forceUpdate();

    // Clear timeouts, if existing
    Object.keys(this.timeouts).forEach(key => {
        clearTimeout(this.timeouts[key]);
    });

    this.setImage();
}

function update() {
    const props = this.lastProps;
    const previousProps = this.previousProps;

    if (!props.viewMode) {
        this.activeCropbox = true;
        const crop = props.operations.crop;
        if (!isEqual(previousProps.crop, crop)) {
            if (previousProps.crop.ratio !== crop.ratio) {
                this.cropper.setAspectRatio(crop.ratio);
            }
            this.load.crop();
        }
    }
    if (!this.loading && previousProps.fitTo !== props.fitTo) {
        this.setContainer();
    }

    if (previousProps.scaledId !== props.scaledId) {
        if (previousProps.sourceId !== props.sourceId) return up.call(this);
        else return this.setImage();
    }

    if (this.loading || props.rendering) return;
    if (this.runOperations(false)) return;
    const diffRatios = () => !isEqual(
        previousProps.operations.resize.ratio,
        props.operations.resize.ratio
    );
    if (diffRatios || previousProps.viewMode !== props.viewMode) {
        this.load.data();
    }
}

export { up, update };
