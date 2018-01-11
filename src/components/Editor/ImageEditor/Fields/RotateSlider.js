import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'components/Elements/Fields/Slider';

class RotateSlider extends React.Component {
    static propTypes = {
        // State (Props)
        value: PropTypes.number.isRequired,
        // Actions (Props)
        changeImage: PropTypes.func.isRequired,
        changeImageTemp: PropTypes.func.isRequired
    };
    handleTempChange = (e) => {
        this.props.changeImageTemp({
            rotate: e.target.value
        });
    };
    handleChange = (e) => {
        this.props.changeImage({
            rotate: e.target.value
        });
    };
    render() {
        return (
            <Slider
                style={{ padding: '22px 24px' }}
                name="rotate-slider"
                value={this.props.value}
                min={-180}
                max={180}
                step={1}
                onChange={this.handleTempChange}
                onAfterChange={this.handleChange}
            />
        );
    }
}

export default RotateSlider;
