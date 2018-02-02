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
    this.active.crop = crop.ratio
        || crop.width.start > 0
        || crop.width.end < 1
        || crop.height.start > 0
        || crop.height.end < 1;
    this.active.cropbox = !props.viewMode || this.active.crop;

    if (this._isMounted && this.active.cropbox) {
        if (props.cropRatio !== crop.ratio) {
            props.crop({
                ratio: props.cropRatio,
                width: { start: 0, end: 1 },
                height: { start: 0, end: 1 }
            });
        }
        this.cropper.setAspectRatio(props.cropRatio);
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
    if (!this.cropper || props.freeze || !props.scaled) return;

    if (!props.viewMode) {
        this.active.cropbox = true;
        if (props.cropRatio !== props.operations.crop.ratio) {
            this.cropper.setAspectRatio(props.cropRatio);
            props.crop({
                ratio: props.cropRatio,
                width: { start: 0, end: 1 },
                height: { start: 0, end: 1 }
            });
            this.load.crop();
        }
    }
    if (!this.loading && this.props.fitTo !== props.fitTo) this.setContainer();

    if (this.props.scaledId !== props.scaledId) {
        if (this.props.sourceId !== props.sourceId) return up.call(this);
        else return this.setImage();
    }

    if (this.loading || props.rendering) return;
    if (this.runOperations(false)) return;
    const diffRatios = () => !isEqual(
        this.props.operations.resize.ratio,
        props.operations.resize.ratio
    );
    if (diffRatios || this.props.viewMode !== props.viewMode) {
        this.load.data();
    }
}

export { up, update };
