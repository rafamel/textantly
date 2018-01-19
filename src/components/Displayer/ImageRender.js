import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, compose } from 'store/utils';
import withBroadcast from 'utils/withBroadcast';
import CanvasEngine from 'engine/CanvasEngine';

const styles = {
    root: {
        textAlign: 'center',
        '& canvas': {
            display: 'none',
            margin: '0 auto',
            '&:last-child': {
                display: 'block'
            }
        }
    }
};

const broadcaster = withBroadcast('freeze');
const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        source: state.edits.source,
        imageEdits: state.edits.image,
        dimensions: state._activeViews.dimensions
    }), (actions) => ({
        setRendering: actions._loading.setRendering,
        setSourceHard: actions.edits.setSourceHard,
        tempForget: actions.edits.tempForget,
        addAlert: actions.alerts.add
    })
);

class ImageRender extends React.Component {
    static propTypes = {
        ...storeTypes,
        exclude: PropTypes.string,
        freeze: PropTypes.bool,
        scale: PropTypes.bool,
        available: PropTypes.object,
        // JSS
        classes: PropTypes.object.isRequired
    };
    static defaultProps = {
        scale: true
    };
    rootNode = null;
    sourceId = { current: null, loading: null };
    canvasEngine = null;
    latest = { available: null, imageEdits: null, scale: true };
    drawCanvas = ({ canvas, maxDimensions }) => {
        const rootNode = this.rootNode;
        if (!rootNode) return;

        rootNode.prepend(canvas);
        if (rootNode.children[1]) rootNode.children[1].remove();
        this.props.setRendering(false);
    };
    loadImage = (source = this.props.source) => {
        const loadFailed = () => {
            if (source.id !== this.sourceId.loading) return;
            this.props.addAlert('Image could not be loaded');
            this.props.tempForget();
            return true;
        };
        if (!this.rootNode) return;

        this.sourceId.loading = source.id;

        const img = new Image();
        img.src = source.src;
        setTimeout(loadFailed, 10000);
        img.onerror = () => {
            if (loadFailed()) this.sourceId.loading = null;
        };
        img.onload = () => {
            if (this.sourceId.loading !== source.id) return;
            this.sourceId = { current: source.id, loading: null };

            const canvasEngine = new CanvasEngine(img, this.drawCanvas);
            canvasEngine.setAvailable(this.latest.available);
            canvasEngine.setEdits(this.latest.imageEdits);
            canvasEngine.scale(this.latest.scale);
            canvasEngine.init();
            this.canvasEngine = canvasEngine;

            this.props.setSourceHard({
                ...source,
                dimensions: {
                    width: img.naturalWidth,
                    height: img.naturalHeight
                }
            });
        };
    };
    customUpdate = (props = this.props) => {
        const available = props.available || props.dimensions || null;
        const imageEdits = (!props.exclude)
            ? props.imageEdits
            : {
                ...props.imageEdits,
                [props.exclude]: undefined
            };
        this.latest = { available, imageEdits, scale: props.scale };

        // Alaways load and redraw if it's a new image
        if (props.source.id !== this.sourceId.current
            && props.source.id !== this.sourceId.loading) {
            return this.loadImage(props.source);
        }

        // Don't continue if it's still loading (freeze is
        // broadcasted when rendering a new image and stops once loaded)
        if (props.freeze) return;

        if (this.canvasEngine) {
            this.canvasEngine.scale(props.scale);
            this.canvasEngine.setAvailable(available);
            this.canvasEngine.setEdits(imageEdits);
        }
    };
    componentWillReceiveProps(nextProps) {
        this.customUpdate(nextProps);
    }
    componentDidMount() {
        this.customUpdate();
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {
        const classes = this.props.classes;
        return (
            <div
                className={classes.root}
                ref={(ref) => { this.rootNode = ref; }}
            >
            </div>
        );
    }
};

export default compose(
    withStyles(styles),
    broadcaster,
    connector
)(ImageRender);
