import React from 'react';
import PropTypes from 'prop-types';
import Slider from '../../Fields/Slider';

class OverlayLengthSlider extends React.Component {
  static propTypes = {
    overlayPosition: PropTypes.string.isRequired,
    overlayWidth: PropTypes.number.isRequired,
    overlayHeight: PropTypes.number.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onAfterChange: PropTypes.func,
    addLabel: PropTypes.bool
  };
  shouldComponentUpdate(nextProps) {
    return (
      this.props.overlayPosition !== nextProps.overlayPosition ||
      this.props.overlayWidth !== nextProps.overlayWidth ||
      this.props.overlayHeight !== nextProps.overlayHeight
    );
  }
  render() {
    const commonProps = {
      min: 0,
      max: 100,
      step: 1,
      className: this.props.className,
      onChange: this.props.onChange,
      onAfterChange: this.props.onAfterChange,
      style: this.props.addLabel ? { marginBottom: 4, padding: 0 } : null
    };
    const overlayPosition = this.props.overlayPosition;
    return overlayPosition === 'top' || overlayPosition === 'bottom' ? (
      <Slider
        name="overlayHeight"
        label={this.props.addLabel ? 'Overlay Height' : null}
        value={this.props.overlayHeight}
        {...commonProps}
      />
    ) : (
      <Slider
        name="overlayWidth"
        value={this.props.overlayWidth}
        label={this.props.addLabel ? 'Overlay Width' : null}
        {...commonProps}
      />
    );
  }
}

export default OverlayLengthSlider;
