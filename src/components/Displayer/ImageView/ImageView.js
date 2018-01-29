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
import config from 'config';
import isEqual from 'lodash.isequal';

const styles = {
    root: {
        overflow: 'hidden',
        position: 'relative',
        '& .cropper-modal': {
            background: 'none'
        }
    },
    noCropViewMode: {
        '& .cropper-point': {
            background: 'none'
        },
        '& .cropper-view-box': {
            boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 0px 9999px'
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            display: 'block',
            zIndex: 1,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    },
    hidden: {
        '& .cropper-container > *': {
            opacity: 0
        }
    },
    noCropBox: {
        '& .cropper-crop-box': {
            display: 'none'
        }
    }
};

const previous = { rotate: null, resize: null };
const viewMode = selectorWithType({
    propType: PropTypes.shape({
        crop: PropTypes.bool.isRequired,
        full: PropTypes.bool.isRequired
    }).isRequired,
    select: [
        state => state.views.isMobile,
        state => state.views.image.main,
        state => state.edits.image.rotate,
        state => state.edits.image.resize.ratio,
        state => selectors.edits.isTemp(state)
    ],
    result: (isMobile, imageView, rotate, resize, isTemp) => {
        let ans = { crop: true, full: false };

        if (isMobile) {
            if (imageView !== 'crop') ans = { crop: false, full: true };
        } else if (isTemp
            && (rotate !== previous.rotate || resize !== previous.resize)) {
            ans.crop = false;
        }

        previous.rotate = rotate;
        previous.resize = resize;
        return ans;
    }
});

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        scaled: state.canvases.scaled.canvas,
        scaledId: state.canvases.scaled.id,
        sourceDimensions: selectors.edits.image.dimensions.source(state),
        viewMode: viewMode(state),
        rendering: state._loading.rendering,
        fitTo: state.views.dimensions,
        operations: state.edits.image
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
    loading = true;
    timeouts = { zoom: null, resize: null };
    cropper = null;
    operations = {
        last: {},
        current: {}
    };
    ratios = {
        canvas: { width: 1, height: 1 }
    };
    data = {
        maxDrawn: { width: 0, height: 0 },
        canvas: {
            position: { x: 0.5, y: 0.5 },
            visible: {
                width: { start: 0, end: 1 },
                height: { start: 0, end: 1 }
            }
        },
        crop: {
            width: { start: 0, end: 1 },
            height: { start: 0, end: 1 }
        }
    };

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
    save = {
        maxDrawn: this.ifm(saveData.maxDrawn.bind(this)),
        canvas: this.ifm(saveData.canvas.bind(this)),
        crop: this.ifm(saveData.crop.bind(this)),
        resetCanvas: saveData.resetCanvas.bind(this)
    };
    load = {
        crop: this.ifm(loadData.crop.bind(this)),
        data: this.ifm(loadData.data.bind(this))
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
    setContainer = (props = this.props) => {
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
            this.ifm(() => {
                const canvasData = this.cropper.getCanvasData();
                if (canvasData.width < 100 || canvasData.height < 100) {
                    this.save.resetCanvas();
                } else {
                    this.save.canvas();
                }
                this.load.crop();
                this.setState({ noCropBox: false });
            })();
        }, 300);
    };
    runOperations = (props = this.props, saveAll = true) => {
        if (!this._isMounted) return;

        let modified = false;
        const modify = (key, cb) => {
            modified = true;
            this.operations.current[key] = this.operations.last[key];
            this.ifm(cb)();
        };

        const { last, current } = this.operations;
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
    setImage = (props = this.props) => {
        if (!props.scaled) return;
        this.loading = true;
        this.setState({ hidden: true });
        // Will trigger onImageReady
        this.ifm(() => this.cropper.replace(props.scaled.toDataURL()))();
    };
    onImageReady = () => {
        this.setContainer();
        this.operations.current = {};
        this.runOperations();

        this.loading = false;
        this.setState({ hidden: false });
        if (this.props.onReady) this.props.onReady();
    };
    componentWillReceiveProps(nextProps) {
        this.operations.last = nextProps.operations;

        if (!this.cropper) return;
        if (!this.loading && this.props.fitTo !== nextProps.fitTo) {
            this.setContainer(nextProps);
        }
        if (nextProps.frozen || !nextProps.scaled) return;

        if (this.props.scaledId !== nextProps.scaledId) {
            this.setImage(nextProps);
            return;
        }

        if (this.loading || nextProps.rendering) return;

        if (
            !this.runOperations(nextProps, false)
            && (
                !isEqual(this.props.viewMode, nextProps.viewMode)
                || this.props.operations.resize !== nextProps.operations.resize
            )
        ) {
            this.load.data(nextProps);
        }
    }
    componentDidMount() {
        this._isMounted = true;
        this.operations.last = this.props.operations;
        this.setImage();

        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.loading = true;
        this.setState({ hidden: true });
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
        const { classes, viewMode } = this.props;

        const activeCrop = () => {
            const crop = this.data.crop;
            return (crop.width.start > 0 || crop.width.end < 1
                || crop.height.start > 0 || crop.height.end < 1);
        };

        return (
            <div className={classnames({
                [classes.root]: true,
                [classes.hidden]: this.state.hidden,
                [classes.noCropBox]: this.state.noCropBox
                    || (!viewMode.crop && !activeCrop()),
                [classes.noCropViewMode]: !viewMode.crop
            })}>
                <Cropper
                    ref={(ref) => { this.cropper = ref; }}
                    style={this.props.fitTo}
                    restore={false}
                    // Cropper.js options
                    viewMode={0}
                    dragMode="move"
                    toggleDragModeOnDblclick={false}
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
