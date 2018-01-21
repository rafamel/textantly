import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, compose } from 'store/utils';
import withBroadcast from 'utils/withBroadcast';
import isEqual from 'lodash.isequal';
import engine from 'engine';
import { selectors } from 'store';

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
        canvas: state.canvases.scaled.canvas,
        canvasId: state.canvases.scaled.id,
        lastScaled: selectors.canvases.lastScaled(state)
    })
);

class ImageRender extends React.Component {
    static propTypes = {
        ...storeTypes,
        freeze: PropTypes.bool,
        // JSS
        classes: PropTypes.object.isRequired
    };
    current = {
        canvas: null,
        canvasId: null,
        dimensions: { width: 0, height: 0 }
    };
    rootNode = null;
    setDimensions = () => {
        if (!this.canvas) return;
        const dimensions = this.current.dimensions;
        this.canvas.style.width = `${dimensions.width}px`;
        this.canvas.style.height = `${dimensions.height}px`;
    }
    drawCanvas = (canvas) => {
        const rootNode = this.rootNode;
        if (!rootNode || !canvas) return;
        this.canvas = canvas;
        this.setDimensions();
        rootNode.prepend(canvas);
        if (rootNode.children[1]) rootNode.children[1].remove();
    };
    customUpdate = (props = this.props) => {
        if (!isEqual(props.lastScaled, this.current.dimensions)) {
            this.current.dimensions = props.lastScaled;
            this.setDimensions();
        }
        if (
            !props.freeze
            && props.canvas
            && props.canvasId !== this.current.canvasId
        ) {
            console.log('image render');
            this.current.canvasId = props.canvasId;
            this.drawCanvas(engine.makeCanvas(props.canvas));
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
