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
        },
        crop: { ...props.operations.crop }
    };

    const crop = props.operations.crop;
    this._cropActive = !props.viewMode
        || crop.width.start > 0
        || crop.width.end < 1
        || crop.height.start > 0
        || crop.height.end < 1;

    if (this._isMounted) this.cropper.setAspectRatio(crop.ratio);
    this.forceUpdate();

    // Clear timeouts, if existing
    Object.keys(this.timeouts).forEach(key => {
        clearTimeout(this.timeouts[key]);
    });

    this.setImage();
}

function update() {
    const props = this.lastProps;
    if (!props.viewMode) this._cropActive = true;

    if (!this.cropper) return;
    if (!this.loading && this.props.fitTo !== props.fitTo) {
        this.setContainer();
    }
    if (props.frozen || !props.scaled) return;

    if (this.props.scaledId !== props.scaledId) {
        if (this.props.sourceId !== props.sourceId) return up.call(this);
        else return this.setImage();
    }

    if (this.loading || props.rendering) return;
    if (this.runOperations(false)) return;

    const diffRatios = !isEqual(
        this.props.operations.resize.ratio,
        props.operations.resize.ratio
    );
    if (diffRatios || this.props.viewMode !== props.viewMode) {
        this.load.data();
    } else if (this.props.cropRatio !== props.cropRatio) {
        this.load.crop();
    }
}

export { up, update };
