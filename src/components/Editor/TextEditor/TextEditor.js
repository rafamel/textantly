import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'store';
import { withStyles } from 'material-ui/styles';
import config from 'config';
import fontData from 'services/font-data';
import Row from './Row';
import Selector, { WeightSelector, ImageSelector } from './Fields/Selector';
import TextInput from './Fields/TextInput';
import { OverlayLengthSlider } from './Fields/Slider';

const fontFamilies = Object.keys(fontData);

const styles = (theme) => ({
    textField: {
        boxSizing: 'border-box',
        margin: `${theme.spacing.unit}px 0`
    }
});

const connector = connect(
    (state) => ({
        text: state.edits.text
    }), {
        changeText: actions.edits.changeText,
        changeTextTemp: actions.edits.changeTextTemp,
        changeSrc: actions.edits.changeSrc,
        loadingStart: actions._loading.start,
        loadingStop: actions._loading.stop,
        addAlert: actions.alerts.add
    }
);

class TextEditor extends React.Component {
    static propTypes = {
        // Props
        className: PropTypes.string,
        // State
        text: PropTypes.object.isRequired,
        // Actions
        changeText: PropTypes.func.isRequired,
        changeTextTemp: PropTypes.func.isRequired,
        changeSrc: PropTypes.func.isRequired,
        loadingStart: PropTypes.func.isRequired,
        loadingStop: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired,
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
        const { classes, text, className } = this.props;
        return (
            <form
                className={className}
                noValidate
                autoComplete="off"
            >
                <Row
                    lateralSeparation={30}
                >
                    <div>
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
                    </div>
                    <div>
                        <ImageSelector
                            changeSrc={this.props.changeSrc}
                            loadingStart={this.props.loadingStart}
                            loadingStop={this.props.loadingStop}
                            addAlert={this.props.addAlert}
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
                        <OverlayLengthSlider
                            overlayPosition={text.overlayPosition}
                            overlayWidth={text.overlayWidth}
                            overlayHeight={text.overlayHeight}
                            className={classes.textField}
                            onChange={this.handleChangeTemp}
                            onAfterChange={this.handleChange}
                        />
                        <Selector
                            id="color-scheme"
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
                    </div>
                </Row>
            </form>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(TextEditor);
