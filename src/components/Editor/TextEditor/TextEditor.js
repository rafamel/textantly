import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'store';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import config from 'config';
import Selector from './Selector';
import WeightSelector from './WeightSelector';
import fontData from 'services/font-data';

const fontFamilies = Object.keys(fontData);

const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        margin: theme.spacing.unit
    }
});

const connector = connect(
    (state) => ({
        text: state.edits.current.text
    }), {
        textEditsHandler: actions.edits.changeText
    }
);

class TextEditor extends React.Component {
    static propTypes = {
        // State
        text: PropTypes.object.isRequired,
        // Actions
        textEditsHandler: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    handleChange = (e) => {
        this.props.textEditsHandler({
            [e.target.name]: e.target.value
        });
    };
    render() {
        const { classes, text } = this.props;
        return (
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    name="textString"
                    label="Text"
                    placeholder={config.defaults.text.textString}
                    value={text.textString}
                    className={classes.textField}
                    onChange={this.handleChange}
                    margin="normal"
                    fullWidth
                />
                <Selector
                    name="fontFamily"
                    id="font-family"
                    label="Font Family"
                    formControl={{
                        className: classes.textField,
                        margin: 'normal',
                        fullWidth: true
                    }}
                    onChange={this.handleChange}
                    value={this.props.text.fontFamily}
                    options={
                        fontFamilies.map(font => ({
                            display: font,
                            value: font
                        }))
                    }
                />
                <WeightSelector
                    name="fontWeight"
                    id="font-weight"
                    label="Font Weight"
                    formControl={{
                        className: classes.textField,
                        margin: 'normal',
                        fullWidth: true
                    }}
                    onChange={this.handleChange}
                    value={this.props.text.fontWeight}
                    fontFamilyWeights={fontData[this.props.text.fontFamily]}
                />
                <Selector
                    name="alignment"
                    id="alignment"
                    label="Text Alignment"
                    formControl={{
                        className: classes.textField,
                        margin: 'normal',
                        fullWidth: true
                    }}
                    onChange={this.handleChange}
                    value={this.props.text.alignment}
                    options={[
                        { display: 'Center', value: 'center' },
                        { display: 'Left', value: 'left' },
                        { display: 'Right', value: 'right' }
                    ]}
                />
            </form>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(TextEditor);
