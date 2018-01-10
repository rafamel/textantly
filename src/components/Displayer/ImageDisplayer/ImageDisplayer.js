import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import isEqual from 'lodash.isequal';
import drawEdits from './engine';

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
}

class ImageDisplayer extends React.Component {
    static propTypes = {
        // State (Props)
        src: PropTypes.object.isRequired,
        imageEdits: PropTypes.object.isRequired,
        // Actions (Props)
        changeSrc: PropTypes.func.isRequired,
        tempForget: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    loadingSrc = null;
    rootNode = null
    canvas = {
        image: null,
        src: null,
        drawnFor: null
    };
    drawCanvas = ({ force } = {}) => {
        const { src, image, drawnFor } = this.canvas;
        const rootNode = this.rootNode;
        if (!src || !image || !rootNode) return;

        const imageEdits = this.props.imageEdits;
        if (
            drawnFor
            && isEqual(imageEdits, drawnFor.imageEdits)
            && drawnFor.src === src
            && !force
        ) {
            return;
        }
        console.log('redrawn');

        let canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d').drawImage(
            image, 0, 0, canvas.width, canvas.height
        );
        canvas = drawEdits(canvas, imageEdits);

        rootNode.prepend(canvas);
        if (rootNode.children[1]) rootNode.children[1].remove();
        this.canvas.drawnFor = { src, imageEdits };
    };
    loadImage = (src) => {
        if (!this.rootNode) return;
        this.loadingSrc = src.src;

        const img = new Image();
        img.src = src.src;
        img.onerror = () => {
            // Load fail
            this.loadingSrc = null;
            this.props.addAlert('Image could not be loaded');
            this.props.tempForget();
        };
        img.onload = () => {
            // Load success
            this.loadingSrc = null;
            this.canvas = {
                src: src.src,
                image: img,
                drawnFor: null
            };
            this.drawCanvas();
            this.props.changeSrc(src);
        };
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.src.src !== this.canvas.src
            && nextProps.src.src !== this.loadingSrc) {
            this.loadImage(nextProps.src);
        } else {
            this.drawCanvas();
        }
    }
    componentDidMount() {
        this.loadImage(this.props.src);
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

export default withStyles(styles)(ImageDisplayer);
