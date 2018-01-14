import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'components/Elements/Fields/Slider';

class RotateSlider extends React.Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        setImageHard: PropTypes.func.isRequired,
        setImageTemp: PropTypes.func.isRequired
    };
    handleTempChange = (e) => {
        this.props.setImageTemp({
            rotate: e.target.value
        });
    };
    handleChange = (e) => {
        this.props.setImageHard({
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
