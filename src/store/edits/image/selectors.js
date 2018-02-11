import PropTypes from 'prop-types';
import { selectorWithType } from 'store/utils';
import engine from 'engine';

const dimensions = {};
const dimensionsPropType = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}).isRequired;

dimensions.source = selectorWithType({
  propType: dimensionsPropType,
  select: [(state) => state.canvases.source.canvas],
  result: (canvas) =>
    canvas
      ? { width: canvas.width, height: canvas.height }
      : { width: 0, height: 0 }
});

dimensions.notResized = selectorWithType({
  propType: dimensionsPropType,
  select: [
    (state) => dimensions.source(state),
    (state) => state.edits.image.rotate,
    (state) => state.edits.image.crop
  ],
  result: (source, rotate, crop) => {
    return engine.getDimensions(source, { rotate, crop });
  }
});

dimensions.drawn = selectorWithType({
  propType: dimensionsPropType,
  select: [(state) => dimensions.source(state), (state) => state.edits.image],
  result: (source, operations) => {
    return engine.getDimensions(source, operations);
  }
});

export default { dimensions };
