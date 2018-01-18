import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import LinkIcon from 'material-ui-icons/Link';
import Slider from '../../Fields/Slider';
import isEqual from 'lodash.isequal';
import resizeEngine from 'engine/resize';

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

class ResizeSliders extends React.Component {
    static propTypes = {
        resize: PropTypes.object.isRequired,
        dimensions: PropTypes.object.isRequired,
        setImageHard: PropTypes.func.isRequired,
        setImageTemp: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        linked: false
    };
    reLink = () => {
        const pc = resizeEngine.getPc(this.props.resize);
        if (!pc.width && !pc.height) return;

        this.props.setImageHard({
            resize: (pc.height > pc.width)
                ? {
                    height: pc.height,
                    width: pc.height
                } : {
                    height: pc.width,
                    width: pc.width
                }
        });
    };
    resizeDimensions = (name, value, forceLink) => {
        const opposites = { width: 'height', height: 'width' };
        const opposite = opposites[name];
        const dimensions = this.props.dimensions;
        const pc = (value * 100) / dimensions[name];
        return (this.state.linked || forceLink)
            ? {
                height: pc,
                width: pc
            } : {
                [name]: pc,
                [opposite]: this.props.resize[opposite]
            };
    };
    toggleLink = () => {
        const linked = this.state.linked;

        if (!linked) this.reLink();
        this.setState({ linked: !linked });
    };
    handleTempChange = (e) => {
        this.props.setImageTemp({
            resize: this.resizeDimensions(e.target.name, e.target.value)
        });
    };
    handleChange = (e) => {
        this.props.setImageHard({
            resize: this.resizeDimensions(e.target.name, e.target.value)
        });
    };
    componentWillMount() {
        const resize = this.props.resize;
        if (resize.height === resize.width) {
            this.setState({ linked: true });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (!isEqual(this.props, nextProps)
            || !isEqual(this.state, nextState));
    }
    render() {
        const { classes, resize, dimensions } = this.props;
        const values = resizeEngine.getDimensions(dimensions, resize);

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
                    value={values.width}
                    min={0}
                    max={dimensions.width}
                    step={1}
                    onChange={this.handleTempChange}
                    onAfterChange={this.handleChange}
                />
                <Slider
                    name="height"
                    label="Height"
                    value={values.height}
                    min={0}
                    max={dimensions.height}
                    step={1}
                    onChange={this.handleTempChange}
                    onAfterChange={this.handleChange}
                />
            </div>
        );
    }
}

export default withStyles(styles)(ResizeSliders);
