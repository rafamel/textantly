import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'store';
import isEqual from 'lodash.isequal';
import engine from 'engine';

const styles = {
    root: {
        maxWidth: '100%',
        textAlign: 'center',
        '& canvas': {
            display: 'none',
            maxWidth: '100%',
            margin: '0 auto',
            '&:last-child': {
                display: 'block'
            }
        }
    }
};

const connector = connect(
    (state) => ({
        source: state.edits.source,
        imageEdits: state.edits.image
    }), {
        changeSource: actions.edits.changeSource,
        tempForget: actions.edits.tempForget,
        addAlert: actions.alerts.add
    }
);

class ImageRender extends React.Component {
    static propTypes = {
        // Props
        exclude: PropTypes.string,
        getDimensions: PropTypes.func,
        // State
        source: PropTypes.object.isRequired,
        imageEdits: PropTypes.object.isRequired,
        // Actions
        changeSource: PropTypes.func.isRequired,
        tempForget: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    src = {
        current: null,
        loading: null
    };
    rootNode = null;
    drawn = {
        image: null,
        for: null
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
            return;
        }

        const canvas = engine.draw(image, { imageEdits });
        rootNode.prepend(canvas);
        if (rootNode.children[1]) rootNode.children[1].remove();
        if (props.getDimensions) {
            props.getDimensions({ width: canvas.width, height: canvas.height });
        }
        this.drawn.for = imageEdits;
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
            this.props.changeSource({
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
        } else {
            this.drawCanvas({ props: nextProps });
        }
    }
    componentDidMount() {
        this.loadImage(this.props.source);
    }
    componentDidUpdate() {
        const rootNode = this.rootNode;
        if (!rootNode) return;
        if (!rootNode.innerHTML) {
            this.drawCanvas({ force: true });
        }
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
    connector
)(ImageRender);
