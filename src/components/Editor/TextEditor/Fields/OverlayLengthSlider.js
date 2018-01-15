import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'components/Elements/Fields/Slider';
import isEqual from 'lodash.isequal';

class OverlayLengthSlider extends React.Component {
    static propTypes = {
        overlayPosition: PropTypes.string.isRequired,
        overlayWidth: PropTypes.number.isRequired,
        overlayHeight: PropTypes.number.isRequired,
        className: PropTypes.string,
        onChange: PropTypes.func,
        onAfterChange: PropTypes.func
    };
    shouldComponentUpdate(nextProps) {
        return !isEqual(this.props, nextProps);
    }
    render() {
        const commonProps = {
            min: 0,
            max: 100,
            step: 1,
            className: this.props.className,
            onChange: this.props.onChange,
            onAfterChange: this.props.onAfterChange,
            style: { marginBottom: 4 }
        };
        const overlayPosition = this.props.overlayPosition;
        return (overlayPosition === 'top' || overlayPosition === 'bottom')
            ? (
                <Slider
                    name="overlayHeight"
                    label="Overlay Height"
                    value={this.props.overlayHeight}
                    {...commonProps}
                />
            ) : (
                <Slider
                    name="overlayWidth"
                    label="Overlay Width"
                    value={this.props.overlayWidth}
                    {...commonProps}
                />
            );
    }
}

export default OverlayLengthSlider;
