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
        fontFamilyWeights: PropTypes.array.isRequired,
        className: PropTypes.string,
        onChange: PropTypes.func
    };
    weights = {
        lastIntentionalWeight: this.props.value,
        isIntentional: true
    };
    handleChange = (e) => {
        this.props.onChange(e);
        this.weights = {
            lastIntentionalWeight: e.target.value,
            isIntentional: true
        };
    };
    componentWillReceiveProps(nextProps) {
        const { lastIntentionalWeight, isIntentional } = this.weights;
        const { fontFamilyWeights, onChange, name } = nextProps;
        const weightInWeights = fontFamilyWeights
            .map(String)
            .indexOf(String(lastIntentionalWeight)) !== -1;

        if (isIntentional) {
            if (!weightInWeights) {
                const lastIntentionalWeightN = Number(lastIntentionalWeight);
                const closestWeight = fontFamilyWeights
                    .map(Number)
                    .reduce((acc, weight) => {
                        const distance = Math.abs(lastIntentionalWeightN - weight);
                        return (acc[1] === -1 || acc[1] > distance)
                            ? [weight, distance]
                            : acc;
                    }, [-1, -1]);
                this.weights.isIntentional = false;
                onChange({ target: { name, value: String(closestWeight[0]) } });
            }
        } else if (weightInWeights) {
            this.weights.isIntentional = true;
            onChange({ target: { name, value: lastIntentionalWeight } });
        }
    }
    shouldComponentUpdate(nextProps) {
        return !isEqual(this.props, nextProps);
    }
    render() {
        return (
            <Selector
                {...this.props}
                onChange={this.handleChange}
                value={String(this.props.value)}
                options={
                    this.props.fontFamilyWeights
                        .map(weight => (
                            { display: weightsDict[weight], value: weight }
                        ))
                }
            />
        );
    }
}

export default WeightSelector;
