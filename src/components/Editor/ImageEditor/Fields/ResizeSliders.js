import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import LinkIcon from 'material-ui-icons/Link';
import Slider from '../../Fields/Slider';
import { selectors } from 'store';

const styles = {
    root: {
        position: 'relative'
    },
    linkButton: {
        width: 36,
        height: 36,
        position: 'absolute',
        top: 'calc(50% + 8px)',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
};

const selector = selectors.edits.image.creators.dimensions('resize');
const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        dimensions: selector(state)
    }), (actions) => ({
        resize: actions.edits.image.resize,
        resizeTemp: actions.edits.image.resizeTemp
    })
);

class ResizeSliders extends React.Component {
    static propTypes = {
        ...storeTypes,
        active: PropTypes.bool,
        // JSS
        classes: PropTypes.object.isRequired
    };
    static defaultProps = {
        active: true
    };
    state = {
        linked: false
    };
    pc = () => {
        const dimensions = this.props.dimensions;
        return {
            height: (dimensions.value.height / dimensions.max.height) || 0,
            width: (dimensions.value.width / dimensions.max.width) || 0
        };
    };
    reLink = () => {
        const dimensions = this.props.dimensions;
        const pc = this.pc();
        const name = (pc.height > pc.width) ? 'height' : 'width';
        this.props.resize(
            this.resizeDimensions(name, dimensions.value[name], true)
        );
    };
    resizeDimensions = (name, value, forceLink) => {
        const opposites = { width: 'height', height: 'width' };
        const opposite = opposites[name];
        const dimensions = this.props.dimensions;
        return (this.state.linked || forceLink)
            ? {
                [name]: value,
                [opposite]: Math.round(
                    (dimensions.max[opposite] * value) / dimensions.max[name]
                )
            } : {
                [name]: value,
                [opposite]: dimensions.value[opposite]
            };
    };
    toggleLink = () => {
        const linked = this.state.linked;

        if (!linked) this.reLink();
        this.setState({ linked: !linked });
    };
    handleTempChange = (e) => {
        this.props.resizeTemp(
            this.resizeDimensions(e.target.name, e.target.value)
        );
    };
    handleChange = (e) => {
        this.props.resize(
            this.resizeDimensions(e.target.name, e.target.value)
        );
    };
    componentWillMount() {
        const pc = this.pc();
        if (Math.abs(pc.height - pc.width) < 0.01) {
            this.setState({ linked: true });
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.active;
    }
    render() {
        const { classes, dimensions } = this.props;
        return (
            <div className={classes.root}>
                <Button
                    className={classes.linkButton}
                    onClick={this.toggleLink}
                    color={(this.state.linked) ? 'primary' : null}
                    aria-label="link"
                    mini
                    fab
                >
                    <LinkIcon />
                </Button>
                <Slider
                    name="width"
                    label="Width"
                    value={dimensions.value.width}
                    min={0}
                    max={dimensions.max.width}
                    step={1}
                    onChange={this.handleTempChange}
                    onAfterChange={this.handleChange}
                />
                <Slider
                    name="height"
                    label="Height"
                    value={dimensions.value.height}
                    min={0}
                    max={dimensions.max.height}
                    step={1}
                    onChange={this.handleTempChange}
                    onAfterChange={this.handleChange}
                />
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(ResizeSliders);
