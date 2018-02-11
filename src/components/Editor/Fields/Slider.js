import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import FreeLabel from './FreeLabel';
import RCSlider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderWithTooltip = createSliderWithTooltip(RCSlider);

const styles = (theme) => {
  const primary = theme.palette.primary.main;
  const pastel = theme.palette.primary.pastel;
  const text = theme.palette.primary.contrastText;
  const body1 = theme.typography.body1;
  return {
    root: {
      width: '100%',
      padding: '22px 24px',
      // Slider
      '& .rc-slider': {
        width: 'calc(100% - 16px)',
        margin: '0 8px'
      },
      // Rail
      '& .rc-slider-rail': {
        width: 'calc(100% + 16px)',
        margin: '0 -8px',
        height: 2
      },
      // Track
      '& .rc-slider-track': {
        backgroundColor: primary,
        height: 2,
        left: '-8px !important'
      },
      // Handle
      '& .rc-slider-handle': {
        borderColor: primary,
        marginTop: -7,
        marginLeft: -8,
        width: 16,
        height: 16,
        '&:active, &:focus': {
          boxShadow: `0 0 5px ${primary}`
        }
      }
    },
    // Tooltip
    tooltip: {
      ...body1,
      fontSize: 12,
      lineHeight: 1,
      fontWeight: 500,
      color: text,
      textShadow: '1px 1px rgba(0, 0, 0, 0.1)'
    },
    '@global': {
      '.rc-slider-tooltip': {
        padding: '0 0 5px',
        margin: '0 0 5px'
      },
      '.rc-slider-tooltip-inner': {
        background: pastel,
        borderRadius: 3,
        padding: '7px 7px 6px',
        position: 'relative',
        height: 'auto',
        width: 'auto',
        minWidth: 28,
        boxShadow: 'none'
      },
      '.rc-slider-tooltip-placement-top .rc-slider-tooltip-arrow': {
        bottom: 0,
        marginLeft: -5,
        borderWidth: '5px 5px 0',
        borderTopColor: pastel
      }
    }
  };
};

class Slider extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.number,
    tooltip: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func,
    onAfterChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    // JSS
    classes: PropTypes.object.isRequired
  };
  onChange = (val) => {
    if (!this.props.onChange) return;
    this.props.onChange({ target: { name: this.props.name, value: val } });
  };
  onAfterChange = (val) => {
    if (!this.props.onAfterChange) return;
    this.props.onAfterChange({ target: { name: this.props.name, value: val } });
  };
  shouldComponentUpdate(nextProps) {
    return (
      this.props.value !== nextProps.value ||
      this.props.min !== nextProps.min ||
      this.props.max !== nextProps.max ||
      this.props.step !== nextProps.step
    );
  }
  render() {
    const props = this.props;
    const classes = props.classes;

    const freeLabel = !props.label ? null : (
      <FreeLabel label={props.label} style={{ marginBottom: 6 }} />
    );
    return (
      <div
        className={classnames(classes.root, props.className)}
        style={props.style}
      >
        {freeLabel}
        <SliderWithTooltip
          value={props.value || 0}
          min={props.min || 0}
          max={props.max || 100}
          step={props.step || 1}
          onChange={this.onChange}
          onAfterChange={this.onAfterChange}
          tipFormatter={(value) => (
            <span className={classes.tooltip}>{props.tooltip || value}</span>
          )}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Slider);
