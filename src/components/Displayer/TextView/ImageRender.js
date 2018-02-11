import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, compose } from 'store/utils';
import withBroadcast from 'utils/withBroadcast';
import engine from 'engine';

const styles = {
  root: {
    textAlign: 'center',
    '& canvas': {
      margin: '0 auto',
      background: 'rgba(0, 0, 0, 0.025)',
      boxShadow: `
                0px 2px 2px -1px rgba(0, 0, 0, 0.05),
                0px 2px 2px 0px rgba(0, 0, 0, 0.05),
                0px 1px 10px 0px rgba(0, 0, 0, 0.05)`
    }
  }
};

const broadcaster = withBroadcast('freeze');
const { connector, propTypes: storeTypes } = withState((state, props) => ({
  drawn: state.canvases.drawn.canvas,
  drawnId: state.canvases.drawn.id,
  isMobile: state.views.isMobile,
  fitTo: state.views.dimensions
}));

class ImageRender extends React.Component {
  static propTypes = {
    ...storeTypes,
    freeze: PropTypes.bool,
    onUpdate: PropTypes.func,
    // JSS
    classes: PropTypes.object.isRequired
  };
  current = {
    id: -1,
    canvas: null,
    fitTo: { width: 0, height: 0 }
  };
  rootNode = null;
  isActive = (props = this.props) => {
    return !props.freeze && props.drawn;
  };
  setDimensions = (props = this.props) => {
    this.current.fitTo = props.fitTo;
    const canvas = this.current.canvas;
    const dimensions = engine.getDimensions(
      { width: canvas.width, height: canvas.height },
      { fit: props.fitTo }
    );
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    if (props.onUpdate) props.onUpdate();
  };
  drawCanvas = (canvas = this.current.canvas, props = this.props) => {
    const rootNode = this.rootNode;
    if (!rootNode || !canvas) return;

    if (rootNode.children) {
      Array.prototype.forEach.call(rootNode.children, (element) =>
        element.remove()
      );
    }

    this.current.id = props.drawnId;
    this.current.canvas = canvas;
    this.setDimensions(props);
    rootNode.prepend(canvas);
    if (props.onUpdate) props.onUpdate();
  };
  customUpdate = (props = this.props) => {
    if (!this.isActive(props)) return;

    if (props.drawnId !== this.current.id) {
      this.drawCanvas(engine.makeCanvas(props.drawn), props);
    } else if (props.fitTo !== this.current.fitTo && this.current.canvas) {
      this.setDimensions(props);
    }
  };
  redrawOnFocus = () => {
    // Mobile browsers dispose the canvas when inactive
    const rootNode = this.rootNode;
    if (
      !this.props.isMobile ||
      !rootNode ||
      !this.current.canvas ||
      !this.isActive()
    ) {
      return;
    }
    this.drawCanvas();
  };
  componentWillReceiveProps(nextProps) {
    this.customUpdate(nextProps);
  }
  componentDidMount() {
    this.customUpdate();
    window.addEventListener('focus', this.redrawOnFocus);
  }
  componentWillUnmount() {
    window.removeEventListener('focus', this.redrawOnFocus);
  }
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    const { classes } = this.props;
    return (
      <div
        className={classes.root}
        ref={(ref) => {
          this.rootNode = ref;
        }}
      />
    );
  }
}

export default compose(withStyles(styles), broadcaster, connector)(ImageRender);
