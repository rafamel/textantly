import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, compose } from 'store/utils';
import withBroadcast from 'utils/withBroadcast';
import isEqual from 'lodash.isequal';
import engine from 'engine';

const styles = {
    root: {
        textAlign: 'center',
        '& canvas': {
            maxWidth: '100%',
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
        getDimensions: PropTypes.func,
        available: PropTypes.object,
        // JSS
        classes: PropTypes.object.isRequired
    };
    rootNode = null;
    src = { current: null, loading: null };
    drawn = {
        canvas: null,
        image: null,
        for: null
    };
    updateAvailable = (props = this.props) => {
        const canvas = this.drawn.canvas;
        if (!canvas) return;

        let available;
        if (props.available) available = props.available;
        else if (props.dimensions) available = props.dimensions;
        if (!available) return;

        let { width, height } = engine.scale({
            width: canvas.width,
            height: canvas.height,
            maxWidth: available.width,
            maxHeight: available.height
        });

        if (width < canvas.width) {
            canvas.style.maxHeight = `${height}px`;
            canvas.style.width = `${width}px`;
        } else if (canvas.style.width) {
            canvas.style.maxHeight = null;
            canvas.style.width = null;
        }
    };
    drawCanvas = ({ image, force, props }) => {
        if (!props) props = this.props;
        if (!image) image = this.drawn.image;
        else this.drawn.image = image;

        const rootNode = this.rootNode;
        if (!rootNode || !image) return;

        const imageEdits = (!props.exclude)
            ? props.imageEdits
            : {
                ...props.imageEdits,
                [props.exclude]: undefined
            };

        if (
            !force
            && this.drawn.for
            && isEqual(imageEdits, this.drawn.for)
        ) {
            return this.updateAvailable(props);
        }

        const canvas = engine.draw(image, { imageEdits });
        if (props.getDimensions) {
            props.getDimensions({ width: canvas.width, height: canvas.height });
        }
        this.drawn.canvas = canvas;
        this.drawn.for = imageEdits;
        this.updateAvailable(props);
        rootNode.prepend(canvas);
        if (rootNode.children[1]) rootNode.children[1].remove();
        props.setRendering(false);
    };
    loadImage = (source) => {
        const loadFailed = () => {
            this.src.loading = null;
            this.props.addAlert('Image could not be loaded');
            this.props.tempForget();
        };
        if (!this.rootNode) return;
        this.src.loading = source.src;

        const img = new Image();
        img.src = source.src;
        img.onerror = () => {
            // Load fail
            loadFailed();
        };
        img.onload = () => {
            // Load success
            this.src.loading = null;
            this.src.current = source.src;
            this.drawCanvas({
                image: img,
                force: true
            });
            this.props.setSourceHard({
                ...source,
                dimensions: {
                    width: img.naturalWidth,
                    height: img.naturalHeight
                }
            });
        };
        setTimeout(() => {
            if (this.src.loading === source.src) {
                loadFailed();
            }
        }, 5000);
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.source.src !== this.src.current
            && nextProps.source.src !== this.src.loading) {
            this.loadImage(nextProps.source);
        } else if (!nextProps.freeze) {
            this.drawCanvas({ props: nextProps });
        }
    }
    componentDidMount() {
        this.loadImage(this.props.source);
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
