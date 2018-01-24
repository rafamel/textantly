import React from 'react';
import { withState } from 'store/utils';
import Slider from '../../Fields/Slider';
import { selectors } from 'store';

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        value: selectors.edits.image.rotate(state)
    }), (actions) => ({
        rotate: actions.edits.image.rotate,
        rotateTemp: actions.edits.image.rotateTemp
    })
);

class RotateSlider extends React.Component {
    static propTypes = {
        ...storeTypes
    };
    handleTempChange = (e) => {
        this.props.rotateTemp(e.target.value);
    };
    handleChange = (e) => {
        this.props.rotate(e.target.value);
    };
    render() {
        return (
            <Slider
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

export default connector(RotateSlider);
