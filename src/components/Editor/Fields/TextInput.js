import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

class TextInput extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onAfterChange: PropTypes.func
  };
  state = {
    timeout: setTimeout
  };
  handleChange = (e) => {
    e = { target: { name: e.target.name, value: e.target.value } };
    this.props.onChange(e);
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    this.setState({
      timeout: setTimeout(() => {
        this.props.onAfterChange(e);
      }, 500)
    });
  };
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }
  render() {
    return (
      <TextField
        name={this.props.name}
        label={this.props.label}
        placeholder={this.props.placeholder}
        value={this.props.value}
        className={this.props.className}
        onChange={this.handleChange}
        onBlur={this.props.onAfterChange}
        margin="normal"
        fullWidth
      />
    );
  }
}

export default TextInput;
