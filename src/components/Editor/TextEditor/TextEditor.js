import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'store';
import { withStyles } from 'material-ui/styles';
import config from 'config';
import fontData from 'services/font-data';
import Selector, { WeightSelector, ImageSelector } from './Fields/Selector';
import TextInput from './Fields/TextInput';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
        text: state.edits.text
    }), {
        changeText: actions.edits.changeText,
        changeTextTemp: actions.edits.changeTextTemp,
        changeSrc: actions.edits.changeSrc
    }
);

class TextEditor extends React.Component {
    static propTypes = {
        // State
        text: PropTypes.object.isRequired,
        // Actions
        changeText: PropTypes.func.isRequired,
        changeTextTemp: PropTypes.func.isRequired,
        changeSrc: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    handleChange = (e) => {
        this.props.changeText({
            [e.target.name]: e.target.value
        });
    };
    handleChangeTemp = (e) => {
        this.props.changeTextTemp({
            [e.target.name]: e.target.value
        });
    };
    render() {
        const { classes, text } = this.props;
        return (
            <form className={classes.container} noValidate autoComplete="off">
                <TextInput
                    id="text-string"
                    name="textString"
                    label="Text"
                    placeholder={config.defaults.text.textString}
                    value={text.textString}
                    className={classes.textField}
                    onChange={this.handleChangeTemp}
                    onAfterChange={this.handleChange}
                />
                <Selector
                    id="font-family"
                    name="fontFamily"
                    label="Font Family"
                    value={text.fontFamily}
                    options={
                        fontFamilies.map(font => ({
                            display: font,
                            value: font
                        }))
                    }
                    className={classes.textField}
                    onChange={this.handleChange}
                />
                <WeightSelector
                    id="font-weight"
                    name="fontWeight"
                    label="Font Weight"
                    value={text.fontWeight}
                    className={classes.textField}
                    onChange={this.handleChange}
                    fontFamilyWeights={fontData[text.fontFamily]}
                />
                <Selector
                    id="text-alignment"
                    name="alignment"
                    label="Text Alignment"
                    className={classes.textField}
                    onChange={this.handleChange}
                    value={text.alignment}
                    options={[
                        { display: 'Center', value: 'center' },
                        { display: 'Left', value: 'left' },
                        { display: 'Right', value: 'right' }
                    ]}
                />
                <ImageSelector
                    changeSrc={this.props.changeSrc}
                />
                <Selector
                    id="overlay-position"
                    name="overlayPosition"
                    label="Overlay Position"
                    className={classes.textField}
                    onChange={this.handleChange}
                    value={text.overlayPosition}
                    options={[
                        { display: 'Left', value: 'left' },
                        { display: 'Right', value: 'right' },
                        { display: 'Top', value: 'top' },
                        { display: 'Bottom', value: 'bottom' }
                    ]}
                />
                <Slider
                    id="overlay-width"
                    value={text.overlayWidth}
                    min={0}
                    max={100}
                    step={2}
                    // label="Overlay Width"
                    onChange={(val) => {
                        this.handleChangeTemp(
                            { target: { name: 'overlayWidth', value: val } }
                        );
                    }}
                    onAfterChange={(val) => {
                        this.handleChange(
                            { target: { name: 'overlayWidth', value: val } }
                        );
                    }}
                />
            </form>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(TextEditor);
