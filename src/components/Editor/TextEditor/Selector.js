import React from 'react';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

class Selector extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired,
        formControl: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired
    };
    render() {
        return (
            <FormControl
                {...this.props.formControl}
            >
                <InputLabel htmlFor={this.props.id}>
                    {this.props.label}
                </InputLabel>
                <Select
                    native
                    name={this.props.name}
                    id={this.props.id}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    input={<Input />}
                >
                    {this.props.options.map(({ display, value}) => (
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
