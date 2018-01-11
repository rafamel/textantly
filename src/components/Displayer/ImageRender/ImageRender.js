import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'store';
import { withStyles } from 'material-ui/styles';
import drawCanvas from './engine';

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
        src: state.edits.src,
        imageEdits: state.edits.image,
        activeViews: state._activeViews
    }), {
        changeSrc: actions.edits.changeSrc,
        tempForget: actions.edits.tempForget,
        addAlert: actions.alerts.add
    }
);

class ImageRender extends React.Component {
    static propTypes = {
        // Props
        getDimensions: PropTypes.func,
        // State
        src: PropTypes.object.isRequired,
        imageEdits: PropTypes.object.isRequired,
        activeViews: PropTypes.object.isRequired,
        // Actions
        changeSrc: PropTypes.func.isRequired,
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
    drawCanvas = drawCanvas.bind(this);
    loadImage = (src) => {
        const loadFailed = () => {
            this.src.loading = null;
            this.props.addAlert('Image could not be loaded');
            this.props.tempForget();
        };
        if (!this.rootNode) return;
        this.src.loading = src.src;

        const img = new Image();
        img.src = src.src;
        img.onerror = () => {
            // Load fail
            loadFailed();
        };
        img.onload = () => {
            // Load success
            this.src.loading = null;
            this.src.current = src.src;
            if (this.props.getDimensions) {
                this.props.getDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            }
            this.drawCanvas({
                image: img,
                force: true
            });
            this.props.changeSrc(src);
        };
        setTimeout(() => {
            if (this.src.loading === src.src) {
                loadFailed();
            }
        }, 5000);
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.src.src !== this.src.current
            && nextProps.src.src !== this.src.loading) {
            this.loadImage(nextProps.src);
        } else {
            this.drawCanvas({ props: nextProps });
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

export default compose(
    withStyles(styles),
    connector
)(ImageRender);
