import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, compose } from 'store/utils';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classnames from 'classnames';
import { selectors } from 'store';
import * as saveData from './save-data';
import * as loadData from './load-data';
import config from 'config';

const styles = {
    root: {
        overflow: 'hidden',
        '& .cropper-modal': {
            background: 'none'
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

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        scaled: state.canvases.scaled.canvas,
        sourceDimensions: selectors.canvases.sourceDimensions(state),
        dimensions: state.views.dimensions,
        operations: state.edits.image,
        isMobile: state.views.isMobile
    })
);

class ImageView extends Component {
    static propTypes = {
        ...storeTypes,
        frozen: PropTypes.bool,
        cropbox: PropTypes.bool,
        // JSS
        classes: PropTypes.object.isRequired
    };
    static defaultProps = {
        cropbox: true
    };
    state = {
        initialized: false,
        hidden: true,
        noCropBox: false
    };
    _isMounted = false;
    timeouts = { zoom: null, resize: null };
    cropper = null;
    operations = {};
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
            top: 0,
            left: 0,
            width: 1,
            height: 1
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
        crop: this.ifm(saveData.crop.bind(this))
    };
    load = {
        crop: this.ifm(loadData.crop.bind(this)),
        data: this.ifm(loadData.data.bind(this))
    };
    onResize = (props) => {
        this.setState({ noCropBox: true });
        clearTimeout(this.timeouts.resize);
        this.timeouts.resize = setTimeout(() => {
            this.setContainer();
        }, 300);
    };
    setContainer = (props = this.props) => {
        if (!this.cropper || !this.cropper.cropper
            || !this.cropper.cropper.cropper) {
            return;
        }

        this.ifm(() => {
            const dimensions = props.dimensions;
            const Cropper = this.cropper.cropper;
            const container = Cropper.cropper;
            Cropper.containerData = dimensions;
            container.style.width = `${dimensions.width}px`;
            container.style.height = `${dimensions.height}px`;
        })();
        this.load.data();
    };
    onCropEnd = () => {
        this.save.crop();
        this.save.canvas();
        this.load.crop();
    };
    onZoom = () => {
        setTimeout(this.load.crop, 100);

        clearTimeout(this.timeouts.zoom);
        this.timeouts.zoom = setTimeout(() => {
            this.load.crop();
            this.save.canvas();
        }, 250);
    };
    runOperations = (props = this.props, forceLoadData = true) => {
        if (!this._isMounted) return;

        let modified = false;
        const modify = (key, cb) => {
            modified = true;
            this.operations[key] = props.operations[key];
            this.ifm(cb)();
        };

        if (props.operations.rotate !== this.operations.rotate) {
            modify('rotate', () => {
                this.cropper.rotateTo(props.operations.rotate);
            });
        }
        if (props.operations.flip !== this.operations.flip) {
            modify('flip', () => {
                this.cropper.scaleX((props.operations.flip) ? -1 : 1);
            });
        }

        if (modified) this.save.maxDrawn();
        if (modified || forceLoadData) {
            this.load.data(props);
            return true;
        }
        return false;
    };
    initialize = (props = this.props) => {
        if (!props.scaled) return;
        // Will trigger ready
        this.ifm(() => this.cropper.replace(props.scaled.toDataURL()))();
    };
    ready = () => {
        this.setContainer();
        this.runOperations();
        this.save.maxDrawn();

        this.setState({ hidden: false, initialized: true });
        if (this.props.onReady) this.props.onReady();
    };
    componentWillReceiveProps(nextProps) {
        if (!this.cropper) return;

        if (
            this.props.dimensions !== nextProps.dimensions
            && this.state.initialized
        ) {
            this.setContainer(nextProps);
        }

        if (nextProps.frozen || !nextProps.scaled) return;
        if (this.state.initialized) this.runOperations(nextProps, false);
        else this.initialize(nextProps);
    }
    componentDidMount() {
        this._isMounted = true;
        this.initialize();
        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.operations = {};
        this.cropper.cropper.destroy();
        this.setState({ initialized: false });
        window.removeEventListener('resize', this.onResize);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.hidden !== nextState.hidden
            || this.state.noCropBox !== nextState.noCropBox
            || this.state.initialized !== nextState.initialized
            || this.props.dimensions !== nextProps.dimensions
            || this.props.isMobile !== nextProps.isMobile;
    }
    render() {
        const { classes, isMobile, cropbox } = this.props;

        // Cropper has a issue with redimensioning
        // when coming to a larger container size from initialization.
        // Initializing to outrageous value
        const style = (this.state.initialized)
            ? this.props.dimensions
            : { width: 10000, height: 10000 };

        return (
            <div className={classnames({
                [classes.root]: true,
                [classes.hidden]: this.state.hidden,
                [classes.noCropBox]: this.state.noCropBox || !cropbox
            })}>
                <Cropper
                    ref={(ref) => { this.cropper = ref; }}
                    style={style}
                    restore={false}
                    // Cropper.js options
                    viewMode={0}
                    dragMode="move" // dragMode={(isMobile) ? 'move' : 'crop'} // chc
                    // movable={isMobile} // chc
                    // zoomOnWheel={false} // chc
                    toggleDragModeOnDblclick={false}
                    guides={false}
                    ready={this.ready}
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
