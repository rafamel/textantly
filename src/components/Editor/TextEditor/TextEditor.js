import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import TopTabs from '../../MobileUI/TopTabs';
import Selector from '../Fields/Selector';
import TextInput from '../Fields/TextInput';
import WeightSelector from './Fields/WeightSelector';
import OverlayLengthSlider from './Fields/OverlayLengthSlider';
import config from 'config';
import { data as fontData } from 'services/fonts';

const fontFamilies = Object.keys(fontData);

const styles = (theme) => ({
    textField: {
        boxSizing: 'border-box',
        margin: `${theme.spacing.unit}px 0`,
        [theme.breakpoints._q.mobile]: {
            margin: 0,
            '& select, & input': {
                height: '1.8em',
                paddingLeft: theme.spacing.unit * 1.5,
                paddingRight: theme.spacing.unit * 1.5
            }
        }
    },
    // Desktop
    form: {
        padding: '10px 20px'
    },
    // Mobile
    tabs: {
        marginLeft: -56,
        width: 'calc(100% + 56px)'
    }
});

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        text: state.edits.text,
        isMobile: state.views.isMobile
    }), (actions) => ({
        setText: actions.edits.text.setText,
        setTextTemp: actions.edits.text.setTextTemp
    })
);

class TextEditor extends React.Component {
    static propTypes = {
        ...storeTypes,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        value: 0
    };
    changeView = (event, value) => {
        this.setState({ value });
    };
    handleChange = (e) => {
        this.props.setText({
            [e.target.name]: e.target.value
        });
    };
    handleChangeTemp = (e) => {
        this.props.setTextTemp({
            [e.target.name]: e.target.value
        });
    };
    render() {
        const { classes, text, theme, isMobile } = this.props;
        const lb = (label) => (!isMobile) ? label : null;
        const fields = [
            <TextInput
                key="textString"
                name="textString"
                label={lb('Text')}
                placeholder={config.defaults.text.textString}
                value={text.textString}
                className={classes.textField}
                onChange={this.handleChangeTemp}
                onAfterChange={this.handleChange}
            />,
            <Selector
                key="fontFamily"
                name="fontFamily"
                label={lb('Font Family')}
                value={text.fontFamily}
                options={
                    fontFamilies.map(font => ({
                        display: font,
                        value: font
                    }))
                }
                className={classes.textField}
                onChange={this.handleChange}
            />,
            <WeightSelector
                key="fontWeight"
                name="fontWeight"
                label={lb('Font Weight')}
                value={text.fontWeight}
                weights={fontData[text.fontFamily]}
                className={classes.textField}
                onChange={this.handleChange}
            />,
            <Selector
                key="alignment"
                name="alignment"
                label={lb('Text Alignment')}
                className={classes.textField}
                onChange={this.handleChange}
                value={text.alignment}
                options={[
                    { display: 'Center', value: 'center' },
                    { display: 'Left', value: 'left' },
                    { display: 'Right', value: 'right' }
                ]}
            />,
            <Selector
                key="overlayPosition"
                name="overlayPosition"
                label={lb('Overlay Position')}
                className={classes.textField}
                onChange={this.handleChange}
                value={text.overlayPosition}
                options={[
                    { display: 'Left', value: 'left' },
                    { display: 'Right', value: 'right' },
                    { display: 'Top', value: 'top' },
                    { display: 'Bottom', value: 'bottom' }
                ]}
            />,
            <OverlayLengthSlider
                key="overlayLength"
                addLabel={!isMobile}
                overlayPosition={text.overlayPosition}
                overlayWidth={text.overlayWidth}
                overlayHeight={text.overlayHeight}
                className={classes.textField}
                onChange={this.handleChangeTemp}
                onAfterChange={this.handleChange}
            />,
            <Selector
                key="colorScheme"
                name="colorScheme"
                label={lb('Color Scheme')}
                className={classes.textField}
                onChange={this.handleChange}
                value={text.colorScheme}
                options={[
                    { display: 'Light', value: 'light' },
                    { display: 'Dark', value: 'dark' }
                ]}
            />
        ];

        return (isMobile)
            ? (
                <React.Fragment>
                    <TopTabs
                        value={this.state.value}
                        onChange={this.changeView}
                        labels={[
                            'Text',
                            'Font Family',
                            'Font Weight',
                            'Alignment',
                            'Position',
                            'Overlay Length',
                            'Color'
                        ]}
                    />
                    <SwipeableViews
                        axis={(theme.direction === 'rtl') ? 'x-reverse' : 'x'}
                        index={this.state.value}
                        animateHeight={true}
                        disabled
                    >
                        {fields}
                    </SwipeableViews>
                </React.Fragment>
            ) : (
                <div className={classes.form}>
                    {fields}
                </div>
            );
    }
}

export default compose(
    withStyles(styles, { withTheme: true }),
    connector
)(TextEditor);
