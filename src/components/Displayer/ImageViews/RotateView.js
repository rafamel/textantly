import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ResizeObserver from 'resize-observer-polyfill';
import ImageRender from '../ImageRender';
import rotateEngine from 'engine/rotate';

const styles = {
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    outer: {
        position: 'relative',
        maxWidth: '100%',
        margin: 'auto',
        overflow: 'hidden'
    },
    inner: {
        margin: 'auto',
        position: 'absolute',
        top: '-500%',
        right: '-500%',
        bottom: '-500%',
        left: '-500%'
    }
};

class RotateView extends React.Component {
    static propTypes = {
        rotate: PropTypes.number,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        outer: { height: 0, width: 0 },
        inner: { height: 0, width: 0 }
    };
    dimensions = {
        available: { width: 0, height: 0 },
        image: { width: 0, height: 0 }
    };
    observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        this.setAvailable({ width, height });
    });
    setAvailable = ({ width, height }) => {
        if (
            width !== this.dimensions.available.width
            || height !== this.dimensions.available.height
        ) {
            // Ignore height
            this.dimensions.available = { width, height: null };
            this.setComputed();
        }
    };
    setImage = ({ width, height }) => {
        if (
            width !== this.dimensions.image.width
            || height !== this.dimensions.image.height
        ) {
            this.dimensions.image = { width, height };
            this.setComputed();
        }
    };
    setComputed = (degrees = this.props.rotate) => {
        const { image, available } = this.dimensions;
        const rotated = rotateEngine.getDimensions(
            { width: image.width, height: image.height }, degrees
        );

        if (available.width === 0 || available.height === 0) {
            return this.setState({
                outer: { height: 0, width: 0 },
                inner: { height: 0, width: 0 }
            });
        }

        const heightDiff = (rotated.height - (available.height || rotated.height));
        const widthDiff = (rotated.width - (available.width || rotated.width));
        if (heightDiff <= 0 && widthDiff <= 0) {
            return this.setState({
                outer: { height: rotated.height, width: rotated.width },
                inner: { height: image.height, width: image.width, maxWidth: 'none' }
            });
        }

        const outer = (heightDiff > widthDiff)
            ? {
                height: available.height,
                width: (rotated.width * available.height) / rotated.height
            } : {
                height: (rotated.height * available.width) / rotated.width,
                width: available.width
            };
        const inner = {
            height: (outer.height * image.height) / rotated.height,
            width: (outer.width * image.width) / rotated.width
        };
        return this.setState({ outer, inner });
    };
    componentWillReceiveProps(nextProps) {
        this.setComputed(nextProps.rotate);
    }
    componentDidMount() {
        this.observer.observe(this.node);
        this.setAvailable({
            width: this.node.clientWidth,
            height: this.node.clientHeight
        });
    }
    componentWillUnmount() {
        this.observer.unobserve(this.node);
    }
    render() {
        const { classes, rotate } = this.props;
        return (
            <div
                ref={(ref) => { this.node = ref; }}
                className={classes.root}
            >
                <div
                    className={classes.outer}
                    style={this.state.outer}
                >
                    <div
                        className={classes.inner}
                        style={{
                            ...this.state.inner,
                            transform: (rotate)
                                ? `rotate(${rotate}deg)` : 'none'
                        }}
                    >
                        <ImageRender
                            exclude="rotate"
                            getDimensions={this.setImage}
                        />
                    </div>
                </div>
            </div>
        );
    }
};

export default withStyles(styles)(RotateView);
