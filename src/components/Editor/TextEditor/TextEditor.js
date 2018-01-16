import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import config from 'config';
import fontData from 'services/font-data';
import Selector from 'components/Elements/Fields/Selector';
import TextInput from 'components/Elements/Fields/TextInput';
import WeightSelector from './Fields/WeightSelector';
import OverlayLengthSlider from './Fields/OverlayLengthSlider';

const fontFamilies = Object.keys(fontData);

const styles = (theme) => ({
    root: {
        padding: '10px 20px'
    },
    textField: {
        boxSizing: 'border-box',
        margin: `${theme.spacing.unit}px 0`
    }
});

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        text: state.edits.text
    }), (actions) => ({
        setTextHard: actions.edits.setTextHard,
        setTextTemp: actions.edits.setTextTemp,
        tempForget: actions.edits.tempForget
    })
);

class TextEditor extends React.Component {
    static propTypes = {
        ...storeTypes,
        // JSS
        classes: PropTypes.object.isRequired
    };
    handleChange = (e) => {
        this.props.setTextHard({
            [e.target.name]: e.target.value
        });
    };
    handleChangeTemp = (e) => {
        this.props.setTextTemp({
            [e.target.name]: e.target.value
        });
    };
    onSubmit = (e) => {
        e.preventDefault();
    };
    render() {
        const { classes, text } = this.props;
        return (
            <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={this.onSubmit}
            >
                <TextInput
                    name="textString"
                    label="Text"
                    placeholder={config.defaults.text.textString}
                    value={text.textString}
                    className={classes.textField}
                    onChange={this.handleChangeTemp}
                    onAfterChange={this.handleChange}
                />
                <Selector
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
                    name="fontWeight"
                    label="Font Weight"
                    value={text.fontWeight}
                    className={classes.textField}
                    onChange={this.handleChange}
                    fontFamilyWeights={fontData[text.fontFamily]}
                />
                <Selector
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
                <Selector
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
                <OverlayLengthSlider
                    overlayPosition={text.overlayPosition}
                    overlayWidth={text.overlayWidth}
                    overlayHeight={text.overlayHeight}
                    className={classes.textField}
                    onChange={this.handleChangeTemp}
                    onAfterChange={this.handleChange}
                />
                <Selector
                    name="colorScheme"
                    label="Color Scheme"
                    className={classes.textField}
                    onChange={this.handleChange}
                    value={text.colorScheme}
                    options={[
                        { display: 'Light', value: 'light' },
                        { display: 'Dark', value: 'dark' }
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
