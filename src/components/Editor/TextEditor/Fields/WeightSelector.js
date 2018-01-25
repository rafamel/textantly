import React from 'react';
import PropTypes from 'prop-types';
import Selector from '../../Fields/Selector';
import isEqual from 'lodash.isequal';

const weightsDict = {
    100: 'Thin',
    200: 'Extra Light',
    300: 'Light',
    400: 'Normal',
    500: 'Medium',
    600: 'Semi Bold',
    700: 'Bold',
    800: 'Extra Bold',
    900: 'Heavy'
};

class WeightSelector extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        weights: PropTypes.array.isRequired,
        className: PropTypes.string,
        onChange: PropTypes.func
    };
    handleChange = (e) => {
        if (this.props.onChange) this.props.onChange(e);
    };
    shouldComponentUpdate(nextProps) {
        return this.props.value !== nextProps.value
            || !isEqual(this.props.weights, nextProps.weights);
    }
    render() {
        return (
            <Selector
                {...this.props}
                onChange={this.handleChange}
                value={String(this.props.value)}
                options={
                    this.props.weights
                        .map(weight => (
                            { display: weightsDict[weight], value: weight }
                        ))
                }
            />
        );
    }
}

export default WeightSelector;
