import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, selectorWithType, compose } from 'store/utils';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classnames from 'classnames';
import { selectors } from 'store';
import * as saveData from './save-data';
import * as loadData from './load-data';
import * as init from './init';
import styles from './styles';
import config from 'config';

const cropRatio = selectorWithType({
    propType: PropTypes.number,
    select: [
        state => state.views.image.crop
    ],
    result: (cropView) => {
        switch (cropView) {
        case 'facebook':
            return 1200 / 630;
        case 'youtube':
            return 1280 / 720;
        case 'square':
            return 1;
        default:
            return null;
        }
    }
});

const viewMode = selectorWithType({
    propType: PropTypes.bool.isRequired,
    select: [
        state => state.views.image.main
    ],
    result: (imageView) => (imageView !== 'crop')
});

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        scaled: state.canvases.scaled.canvas,
        scaledId: state.canvases.scaled.id,
        sourceId: state.canvases.scaled.forSourceId,
        sourceDimensions: selectors.edits.image.dimensions.source(state),
        viewMode: viewMode(state),
        cropRatio: cropRatio(state),
        rendering: state._loading.rendering,
        fitTo: state.views.dimensions,
        operations: state.edits.image,
        isMobile: state.views.isMobile
    }), (actions) => ({
        crop: actions.edits.image.crop
    })
);

class ImageView extends Component {
    static propTypes = {
        ...storeTypes,
        frozen: PropTypes.bool,
        onReady: PropTypes.func,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        hidden: true,
        noCropBox: false
    };
    _isMounted = false;
    lastProps = null;
    loading = true;
    timeouts = { zoom: null, resize: null };
    cropper = null;
    operations = null;
    data = null;
    _cropActive = false;
    ifm = (cb) => (...args) => {
        if (!this._isMounted) return;
        /* eslint-disable */
        try {
            return cb(...args);
        } catch (err) {
            if (!config.production) console.warn(err);
        }
        /* eslint-enable */
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
    onResize = (props) => {
        this.setState({ hidden: true });
        clearTimeout(this.timeouts.resize);
        this.timeouts.resize = setTimeout(() => {
            if (!props.rendering && !this.loading && this._isMounted) {
                this.setContainer();
                this.setState({ hidden: false });
            }
        }, 500);
    };
    setContainer = () => {
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
        this.load.data();
    };
    onCropEnd = () => {
        this.save.crop();
        this.save.canvas();
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
    runOperations = (saveAll = true) => {
        const props = this.lastProps;
        if (!this._isMounted) return;

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

        if (modified || saveAll) {
            this.save.maxDrawn();
            this.load.data(props);
            return true;
        }
        return false;
    };
    setImage = () => {
        const props = this.lastProps;
        if (!props.scaled) return;

        this.loading = true;
        this.setState({ hidden: true });
        // Will trigger onImageReady
        this.ifm(() => this.cropper.replace(props.scaled.toDataURL()))();
    };
    onImageReady = () => {
        this.setContainer();
        this.operations = {};
        this.runOperations();

        this.loading = false;
        this.setState({ hidden: false });
        if (this.props.onReady) this.props.onReady();
    };
    componentWillReceiveProps(nextProps) {
        this.lastProps = nextProps;
        this.init.update(nextProps);
    }
    componentDidMount() {
        this._isMounted = true;
        this.lastProps = this.props;
        this.init.up();
        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.cropper.cropper.destroy();
        window.removeEventListener('resize', this.onResize);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.hidden !== nextState.hidden
            || this.state.noCropBox !== nextState.noCropBox
            || this.props.fitTo !== nextProps.fitTo
            || this.props.viewMode !== nextProps.viewMode;
    }
    render() {
        const { classes, viewMode, isMobile } = this.props;

        const activeCrop = () => {
            if (!this.data) return false;
            const crop = this.data.crop;
            return (crop.width.start > 0 || crop.width.end < 1
                || crop.height.start > 0 || crop.height.end < 1);
        };

        return (
            <div className={classnames({
                [classes.root]: true,
                [classes.hidden]: this.state.hidden,
                [classes.noCropBox]: this.state.noCropBox
                    || (viewMode && !activeCrop()),
                [classes.viewMode]: viewMode
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
    connector
)(ImageView);
