import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import ResizeObserver from 'resize-observer-polyfill';

const styles = {
    root: {
        overflow: 'hidden'
    }
};

class ResponsiveSwipeable extends React.Component {
    static propTypes = {
        children: PropTypes.array.isRequired,
        index: PropTypes.number,
        onChangeIndex: PropTypes.func,
        // JSS
        theme: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired
    };
    nodes = {};
    state = {
        activeIndex: this.props.index || 0,
        maxHeight: 'none'
    };
    setNode = (key) => (ref) => { this.nodes[key] = ref; };
    observer = new ResizeObserver((entries) => {
        try {
            this.measureActive(entries[0].contentRect.height);
        } catch (e) { this.measureActive(); }
    });
    measureActive = (height) => {
        const maxHeight = height
            || this.nodes[this.state.activeIndex].clientHeight
            || 'none';

        if (maxHeight === this.state.maxHeight) return;
        this.setState({ maxHeight });
    };
    handleChange = (index) => {
        const previousIndex = this.state.activeIndex;
        if (index === undefined
            || index === previousIndex
            || !Object.keys(this.nodes).length) {
            return;
        }

        this.observer.unobserve(this.nodes[previousIndex]);
        this.setState({ activeIndex: index });
        this.measureActive();
        this.observer.observe(this.nodes[index]);
    };
    swipeableChange = (index) => {
        this.handleChange(index);
        if (this.props.onChangeIndex) this.props.onChangeIndex(index);
    };
    componentWillReceiveProps(nextProps) { this.handleChange(nextProps.index); }
    componentDidMount() {
        this.observer.observe(this.nodes[this.state.activeIndex]);
        this.measureActive();
    }
    componentWillUnmount() {
        this.observer.unobserve(this.nodes[this.state.activeIndex]);
    }
    render() {
        const { theme, classes, children } = this.props;
        return (
            <div
                className={classes.root}
                style={{ maxHeight: this.state.maxHeight }}
            >
                <SwipeableViews
                    axis={
                        (theme.direction === 'rtl') ? 'x-reverse' : 'x'
                    }
                    index={this.state.activeIndex}
                    animateHeight={false}
                    onChangeIndex={this.swipeableChange}
                >
                    {children.map((child, i) => (
                        <div
                            ref={this.setNode(i)}
                            key={`${classes.root}_${i}`}
                        >
                            {child}
                        </div>
                    ))}
                </SwipeableViews>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ResponsiveSwipeable);
