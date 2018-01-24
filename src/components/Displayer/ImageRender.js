import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, compose, selectorWithType } from 'store/utils';
import withBroadcast from 'utils/withBroadcast';
import isEqual from 'lodash.isequal';
import engine, { Operation } from 'engine';
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

const lastScaledSelector = selectorWithType({
    propType: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    select: [
        state => state.views.dimensions,
        state => selectors.canvases.drawnDimensions(state),
        state => state.edits.image.last,
        (_, props) => (props) ? props.exclude : null
    ],
    result: (viewsDimensions, drawnDimensions, lastOp, exclude) => {
        const lastDimensions = (!lastOp || (exclude && lastOp.is(exclude)))
            ? drawnDimensions
            : engine.getDimensions(drawnDimensions, [lastOp]);

        return engine.getDimensions(
            lastDimensions,
            [new Operation('scale', viewsDimensions)]
        );
    }
});

const broadcaster = withBroadcast('freeze');
const { connector, propTypes: storeTypes } = withState(
    (state, props) => ({
        scaled: state.canvases.scaled.canvas,
        scaledId: state.canvases.scaled.id,
        drawnDimensions: selectors.canvases.drawnDimensions(state),
        lastDimensions: lastScaledSelector(state, props),
        isScaledSynced: selectors.canvases.isScaledSynced(state),
        lastOp: state.edits.image.last,
        doUpdate: selectors.views.doUpdate(state)
    })
);

class ImageRender extends React.Component {
    static propTypes = {
        ...storeTypes,
        freeze: PropTypes.bool,
        onUpdate: PropTypes.func,
        // JSS
        classes: PropTypes.object.isRequired
    };
    scaled = {
        id: -1,
        canvas: null
    };
    current = {
        canvas: null,
        dimensions: { width: 0, height: 0 },
        forLast: null
    };
    _queuedSetDimensions = false;
    rootNode = null;
    setDimensions = () => {
        if (!this.current.canvas) return;
        const dimensions = this.current.dimensions;
        this.current.canvas.style.width = `${dimensions.width}px`;
        this.current.canvas.style.height = `${dimensions.height}px`;
    };
    drawCanvas = (canvas) => {
        const rootNode = this.rootNode;
        if (!rootNode || !canvas) return;
        this.current.canvas = canvas;
        this.setDimensions();
        rootNode.prepend(canvas);
        if (this.props.onUpdate) this.props.onUpdate();
        if (rootNode.children[1]) rootNode.children[1].remove();
    };
    customUpdate = (props = this.props) => {
        if (!isEqual(props.lastDimensions, this.current.dimensions)) {
            this.current.dimensions = props.lastDimensions;
            this._queuedSetDimensions = true;
        }

        if (props.freeze || !props.scaled
            || !props.isScaledSynced || !props.doUpdate) {
            return;
        }

        let doLast = false;
        if (props.scaledId !== this.scaled.id) {
            doLast = true;
            this.scaled = {
                id: props.scaledId,
                canvas: props.scaled
            };
        }
        if (doLast || !isEqual(props.lastOp, this.current.forLast)) {
            this._queuedSetDimensions = false;
            this.current.forLast = props.lastOp;
            const canvas = engine.draw(
                engine.makeCanvas(this.scaled.canvas),
                [props.lastOp],
                props.drawnDimensions
            );
            this.drawCanvas(canvas);
        }

        if (this._queuedSetDimensions) this.setDimensions();
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
