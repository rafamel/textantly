import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withState, compose } from 'store/utils';
import withBroadcast from 'utils/withBroadcast';
import ImageRender from '../ImageRender';
import rotateEngine from 'engine/rotate';
import engine from 'engine';

const styles = {
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

const broadcaster = withBroadcast('freeze');
const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        rotate: state.edits.image.rotate,
        available: state._activeViews.dimensions
    })
);

class RotateView extends React.Component {
    static propTypes = {
        ...storeTypes,
        freeze: PropTypes.bool,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        outer: { height: 0, width: 0 },
        inner: {}
    };
    imageDimensions = { width: 0, height: 0 };
    setImageDimensions = ({ width, height }) => {
        if (
            width !== this.imageDimensions.width
            || height !== this.imageDimensions.height
        ) {
            this.imageDimensions = { width, height };
            this.setComputed();
        }
    };
    setComputed = (degrees = this.props.rotate) => {
        const image = this.imageDimensions;
        const available = this.props.available;
        if (!available.height || !available.width
            || !image.height || !image.width) {
            return this.setState({ outer: { width: 0, height: 0 } });
        }

        const rotated = rotateEngine.getDimensions(image, degrees);
        const outer = (rotated.width <= available.width
            && rotated.height <= available.height)
            ? { width: rotated.width, height: rotated.height }
            : engine.scale({
                ...rotated,
                maxHeight: available.height,
                maxWidth: available.width
            });
        const inner = {
            height: Math.round(
                (outer.height * image.height) / rotated.height
            ),
            width: Math.round(
                (outer.width * image.width) / rotated.width
            )
        };
        return this.setState({ outer, inner });
    };
    componentWillReceiveProps(nextProps) {
        this.setComputed(nextProps.rotate);
    }
    componentDidMount() {
        this.setComputed();
    }
    shouldComponentUpdate(nextProps) {
        return !nextProps.freeze;
    }
    render() {
        const { classes, rotate } = this.props;
        return (
            <div
                ref={(ref) => { this.node = ref; }}
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
                        available={this.state.inner}
                        exclude='rotate'
                        getDimensions={this.setImageDimensions}
                    />
                </div>
            </div>
        );
    }
};

export default compose(
    broadcaster,
    connector,
    withStyles(styles)
)(RotateView);
