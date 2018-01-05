import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import FreeLabel from '../FreeLabel';
import RCSlider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderWithTooltip = createSliderWithTooltip(RCSlider);

const styles = (theme) => {
    const primary = theme.palette.primary['500'];
    const body1 = theme.typography.body1;
    return {
        root: {
            width: '100%',
            // Slider
            '& .rc-slider': {
                width: 'calc(100% - 16px)',
                margin: '0 8px'
            },
            // Track
            '& .rc-slider-rail': {
                width: 'calc(100% + 16px)',
                margin: '0 -8px',
                height: 2
            },
            //
            '& .rc-slider-track': {
                backgroundColor: primary,
                height: 2,
                left: '-8px !important'
            },
            // Handle
            '& [role=\'slider\']': {
                borderColor: primary,
                marginTop: -7,
                marginLeft: -8,
                width: 16,
                height: 16,
                '&:active': {
                    boxShadow: `0 0 5px ${primary}`
                }
            }
        },
        tooltip: {
            ...body1,
            color: '#fff',
            lineHeight: 1.2
        }
    };
};

class Slider extends React.Component {
    static propTypes = {
        // Props
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        height: PropTypes.number,
        onChange: PropTypes.func,
        onAfterChange: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
        // JSS
        classes: PropTypes.object.isRequired
    };
    onChange = (val) => {
        if (!this.props.onChange) return;
        this.props.onChange(
            { target: { name: this.props.name, value: val } }
        );
    };
    onAfterChange = (val) => {
        if (!this.props.onAfterChange) return;
        this.props.onAfterChange(
            { target: { name: this.props.name, value: val } }
        );
    };
    render() {
        const { classes, className, style, label } = this.props;
        return (
            <div
                className={ classnames(classes.root, className) }
                style={style}
            >
                <FreeLabel
                    label={label}
                    style={{ marginBottom: 6 }}
                />
                <SliderWithTooltip
                    id={this.props.id}
                    value={this.props.value}
                    min={0}
                    max={100}
                    step={2}
                    onChange={this.onChange}
                    onAfterChange={this.onAfterChange}
                    tipFormatter={value => (
                        <span className={classes.tooltip}>{value}</span>
                    )}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Slider);
