import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'components/Elements/Fields/Slider';

class ResizeSliders extends React.Component {
    static propTypes = {
        value: PropTypes.object.isRequired,
        dimensions: PropTypes.object.isRequired,
        changeImage: PropTypes.func.isRequired,
        changeImageTemp: PropTypes.func.isRequired
    };
    handleTempChange = (key) => (e) => {
        // this.props.changeImageTemp({
        //     resize: e.target.value
        // });
    };
    handleChange = (key) => (e) => {
        // this.props.changeImage({
        //     resize: e.target.value
        // });
    };
    render() {
        const { value, dimensions } = this.props;
        return (
            <div>
                {/* <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleChange('checkedA')}
                    aria-label="checkedA"
                /> */}
                <Slider
                    style={{ padding: '22px 24px' }}
                    name="resize-slider"
                    label="Width"
                    value={value.width || dimensions.width}
                    min={0}
                    max={dimensions.width}
                    step={1}
                    onChange={this.handleTempChange('width')}
                    onAfterChange={this.handleChange('width')}
                />
                <Slider
                    style={{ padding: '22px 24px' }}
                    name="resize-slider"
                    label="Height"
                    value={value.height || dimensions.height}
                    min={0}
                    max={dimensions.height}
                    step={1}
                    onChange={this.handleTempChange('height')}
                    onAfterChange={this.handleChange('height')}
                />
            </div>
        );
    }
}

export default ResizeSliders;
