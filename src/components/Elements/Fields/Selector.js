import React from 'react';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import isEqual from 'lodash.isequal';

class Selector extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired,
        className: PropTypes.string,
        onChange: PropTypes.func
    };
    shouldComponentUpdate(nextProps) {
        return !isEqual(this.props, nextProps);
    }
    render() {
        const label = (!this.props.label) ? null : (
            <InputLabel>
                {this.props.label}
            </InputLabel>
        );
        return (
            <FormControl
                className={this.props.className}
                margin="normal"
                fullWidth
            >
                {label}
                <Select
                    native
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    input={<Input />}
                >
                    {this.props.options.map(({ display, value }) => (
                        <option
                            value={value}
                            key={this.props.name + value}
                        >
                            {display}
                        </option>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default Selector;
