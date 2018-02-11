import React from 'react';
import PropTypes from 'prop-types';
import { withState, selectorWithType } from 'store/utils';
import Slider from '../../Fields/Slider';
import { selectors } from 'store';

const currentMin = selectorWithType({
  propType: PropTypes.string.isRequired,
  select: [(state) => selectors.edits.image.dimensions.notResized(state)],
  result: (maxDimensions) => {
    return maxDimensions.width > maxDimensions.height ? 'height' : 'width';
  }
});

const values = selectorWithType({
  propType: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  select: [
    (state) => currentMin(state),
    (state) => state.edits.image.resize,
    (state) => selectors.edits.image.dimensions.notResized(state)
  ],
  result: (currentMin, resize, maxDimensions) => {
    return resize.width && resize.height
      ? resize
      : {
          width: Math.round(maxDimensions.width * resize.ratio),
          height: Math.round(maxDimensions.height * resize.ratio)
        };
  }
});

const { connector, propTypes: storeTypes } = withState(
  (state) => ({
    maxDimensions: selectors.edits.image.dimensions.notResized(state),
    values: values(state),
    currentMin: currentMin(state)
  }),
  (actions) => ({
    resize: actions.edits.image.resize,
    resizeTemp: actions.edits.image.resizeTemp
  })
);

class ResizeSliders extends React.Component {
  static propTypes = {
    ...storeTypes,
    active: PropTypes.bool
  };
  static defaultProps = {
    active: true
  };
  resizeDimensions = (name, value) => {
    const opposites = { width: 'height', height: 'width' };
    const { maxDimensions, currentMin } = this.props;
    const ratio = value / maxDimensions[currentMin] || 0;
    return {
      ratio,
      [currentMin]: value,
      [opposites[currentMin]]: Math.round(
        maxDimensions[opposites[currentMin]] * ratio
      )
    };
  };
  handleTempChange = (e) => {
    this.props.resizeTemp(this.resizeDimensions(e.target.name, e.target.value));
  };
  handleChange = (e) => {
    this.props.resize(this.resizeDimensions(e.target.name, e.target.value));
  };
  shouldComponentUpdate(nextProps) {
    return nextProps.active;
  }
  render() {
    const { maxDimensions, values, currentMin } = this.props;

    return (
      <Slider
        name="width"
        tooltip={`${values.width}:${values.height}`}
        value={values[currentMin]}
        min={1}
        max={maxDimensions[currentMin]}
        step={1}
        onChange={this.handleTempChange}
        onAfterChange={this.handleChange}
      />
    );
  }
}

export default connector(ResizeSliders);
