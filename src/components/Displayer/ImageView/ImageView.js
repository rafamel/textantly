import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, selectorWithType, compose } from 'store/utils';
import withBroadcast from 'utils/withBroadcast';
import Cropper from 'react-cropper';
import warn from 'utils/warn';
import 'cropperjs/dist/cropper.css';
import classnames from 'classnames';
import { selectors } from 'store';
import * as saveData from './save-data';
import * as loadData from './load-data';
import * as init from './init';
import styles from './ImageView.styles';

const viewMode = selectorWithType({
    propType: PropTypes.bool.isRequired,
    select: [
        state => state.edits.navigation.image
    ],
    result: (navImage) => (navImage !== 'crop')
});

const broadcaster = withBroadcast('freeze');
const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        scaled: state.canvases.scaled.canvas,
        scaledId: state.canvases.scaled.id,
        sourceId: state.canvases.scaled.forSourceId,
        sourceDimensions: selectors.edits.image.dimensions.source(state),
        viewMode: viewMode(state),
        rendering: state._loading.rendering,
        fitTo: state.views.dimensions,
        operations: state.edits.image,
        isMobile: state.views.isMobile
    }), (actions) => ({
        crop: actions.edits.image.crop,
        setLoading: actions._loading.setLoading
    })
);

class ImageView extends Component {
    static propTypes = {
        ...storeTypes,
        freeze: PropTypes.bool,
        onUpdate: PropTypes.func,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        hidden: true,
        noCropBox: false,
        activeCrop: false
    };
    _isMounted = false;
    lastProps = null;
    previousProps = null;
    loading = true;
    timeouts = { zoom: null, resize: null };
    cropper = null;
    operations = null;
    data = null;
    ifm = (cb) => (...args) => {
        if (!this._isMounted) return;
        try {
            // eslint-disable-next-line
            return cb(...args);
        } catch (err) {
            warn(err);
        }
    };
    init = {
        up: init.up.bind(this),
        update: init.update.bind(this)
    };
    load = {
        crop: this.ifm(loadData.crop.bind(this)),
        data: this.ifm(loadData.data.bind(this))
    };
    save = {
        maxDrawn: this.ifm(saveData.maxDrawn.bind(this)),
        canvas: this.ifm(saveData.canvas.bind(this)),
        crop: this.ifm(saveData.crop.bind(this))
    };
    setContainerAndRun = () => {
        const props = this.lastProps;
        if (!this.cropper || !this.cropper.cropper
            || !this.cropper.cropper.cropper) {
            return;
        }

        this.ifm(() => {
            const fitTo = props.fitTo;
            const Cropper = this.cropper.cropper;
            Cropper.containerData = fitTo;
            Cropper.cropBoxData.maxWidth = fitTo.width;
            Cropper.cropBoxData.maxHeight = fitTo.height;

            const container = Cropper.cropper;
            container.style.width = `${fitTo.width}px`;
            container.style.height = `${fitTo.height}px`;
        })();

        // Cropper.js has the ocasional issue with redimensionings
        // as sometimes it's not aware of the operations on an image
        // if not performed immediatly beforehand.
        // We'll force a full operation redraw after resetting the container,
        // which will in turn also load the data
        this.operations = {};
        this.runOperations();
    };
    runOperations = (forceLoad = true) => {
        const props = this.lastProps;
        if (!this._isMounted) return false;

        let modified = false;
        const modify = (key, cb) => {
            modified = true;
            this.operations[key] = props.operations[key];
            this.ifm(cb)();
        };

        const current = this.operations;
        const last = props.operations;
        if (last.rotate !== current.rotate) {
            modify('rotate', () => {
                this.cropper.rotateTo(last.rotate);
            });
        }

        if (last.flip !== current.flip) {
            modify('flip', () => {
                this.cropper.scaleX((last.flip) ? -1 : 1);
            });
        }

        if (modified) this.save.maxDrawn();
        if (modified || forceLoad) {
            this.load.data(props);
            return true;
        }

        return false;
    };
    onCropEnd = () => {
        this.save.canvas();
        this.save.crop();
    };
    onZoom = () => {
        this.setState({ noCropBox: true });

        clearTimeout(this.timeouts.zoom);
        this.timeouts.zoom = setTimeout(() => {
            this.save.canvas();
            this.load.crop();
            if (this._isMounted) this.setState({ noCropBox: false });
        }, 300);
    };
    setImage = () => {
        const props = this.lastProps;
        if (!props.scaled) return;

        this.loading = true;
        this.props.setLoading(true);
        this.setState({ hidden: true });
        // Will trigger onImageReady
        this.ifm(() => this.cropper.replace(props.scaled.toDataURL()))();
    };
    onImageReady = () => {
        this.setContainerAndRun();
        this.save.maxDrawn();

        this.loading = false;
        this.props.setLoading(false);
        this.setState({ hidden: false });
        if (this.props.onUpdate) this.props.onUpdate();
    };
    componentWillReceiveProps(nextProps) {
        this.lastProps = nextProps;
        if (!this.cropper || nextProps.freeze || !nextProps.scaled) return;
        this.init.update(nextProps);
        this.previousProps = nextProps;
    }
    componentDidMount() {
        this._isMounted = true;
        this.lastProps = this.props;
        this.previousProps = this.props;
        this.init.up();
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.cropper.cropper.destroy();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.hidden !== nextState.hidden
            || this.state.noCropBox !== nextState.noCropBox
            || this.state.activeCrop !== nextState.activeCrop
            || this.props.fitTo !== nextProps.fitTo
            || this.props.viewMode !== nextProps.viewMode;
    }
    render() {
        const { classes, viewMode, isMobile } = this.props;
        return (
            <div className={classnames({
                [classes.root]: true,
                [classes.hidden]: this.state.hidden,
                [classes.noCropBox]: this.state.noCropBox
                    || (viewMode && !this.state.activeCrop),
                [classes.viewMode]: viewMode,
                [classes.hiddenViewMode]: this.state.hidden
                    && viewMode && this.state.activeCrop
            })}>
                <Cropper
                    ref={(ref) => { this.cropper = ref; }}
                    style={this.props.fitTo}
                    restore={false}
                    // Cropper.js options
                    viewMode={0}
                    dragMode={(isMobile) ? 'move' : 'crop'}
                    zoomOnWheel={isMobile}
                    zoomOnTouch={isMobile}
                    toggleDragModeOnDblclick={false}
                    autoCropArea={1}
                    guides={false}
                    ready={this.onImageReady}
                    zoom={this.onZoom}
                    cropend={this.onCropEnd}
                />
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    broadcaster,
    connector
)(ImageView);
