import React from 'react';
import PropTypes from 'prop-types';
import Slider from './Slider';

class OverlayLengthSlider extends React.Component {
    static propTypes = {
        // Props
        overlayPosition: PropTypes.string.isRequired,
        overlayWidth: PropTypes.number.isRequired,
        overlayHeight: PropTypes.number.isRequired,
        className: PropTypes.string,
        onChange: PropTypes.func,
        onAfterChange: PropTypes.func
    };
    render() {
        const commonProps = {
            min: 0,
            max: 100,
            step: 2,
            className: this.props.className,
            onChange: this.props.onChange,
            onAfterChange: this.props.onAfterChange,
            style: { marginBottom: 4 }
        };
        const overlayPosition = this.props.overlayPosition;
        return (overlayPosition === 'top' || overlayPosition === 'bottom')
            ? (
                <Slider
                    id="overlay-height"
                    name="overlayHeight"
                    label="Overlay Height"
                    value={this.props.overlayHeight}
                    {...commonProps}
                />
            ) : (
                <Slider
                    id="overlay-width"
                    name="overlayWidth"
                    label="Overlay Width"
                    value={this.props.overlayWidth}
                    {...commonProps}
                />
            );
    }
}

export default OverlayLengthSlider;
