import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'store/utils';
import Slider from '../../Fields/Slider';

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        value: state.edits.image.rotate
    }), (actions) => ({
        rotate: actions.edits.image.rotate,
        rotateTemp: actions.edits.image.rotateTemp
    })
);

class RotateSlider extends React.Component {
    static propTypes = {
        ...storeTypes,
        active: PropTypes.bool
    };
    static defaultProps = {
        active: true
    };
    handleTempChange = (e) => {
        this.props.rotateTemp(e.target.value);
    };
    handleChange = (e) => {
        this.props.rotate(e.target.value);
    };
    shouldComponentUpdate(nextProps) {
        return nextProps.active;
    }
    render() {
        return (
            <Slider
                name="rotate-slider"
                value={this.props.value}
                min={-180}
                max={180}
                step={2}
                onChange={this.handleTempChange}
                onAfterChange={this.handleChange}
            />
        );
    }
}

export default connector(RotateSlider);
