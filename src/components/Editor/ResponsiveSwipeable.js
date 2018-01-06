import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import Transition from 'react-transition-group/Transition';
import ResizeObserver from 'resize-observer-polyfill';

const duration = 300;

const styles = {
    root: {
        overflow: 'hidden',
        transition: `max-height linear ${duration}ms`
    }
};

const getTransitionStyle = (previous = 'none', updated = 'none') => {
    return {
        entering: { maxHeight: previous },
        entered: { maxHeight: updated }
    };
};

class ResponsiveSwipeable extends React.Component {
    static propTypes = {
        // Props
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
        observer: null,
        maxHeight: {
            previous: 'none',
            updated: 'none'
        }
    };
    setNode = (key) => (ref) => { this.nodes[key] = ref; };
    observer = new ResizeObserver((entries) => {
        try {
            this.measureActive(entries[0].contentRect.height);
        } catch (e) { this.measureActive(); }
    });
    measureActive = (height) => {
        const updated = height
            || this.nodes[this.state.activeIndex].clientHeight
            || 'none';
        const previous = this.state.maxHeight.updated || 'none';

        if (updated === previous) return;
        this.setState({ maxHeight: { previous, updated } });
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
        this.measureActive();
        this.observer.observe(this.nodes[this.state.activeIndex]);
    }
    render() {
        const { theme, classes, children } = this.props;
        const { previous, updated } = this.state.maxHeight;
        const transitionStyle = getTransitionStyle(previous, updated);
        return (
            <Transition in={true} timeout={duration}>
                {(state) => (
                    <div
                        className={classes.root}
                        style={transitionStyle[state]}
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
                )}
            </Transition>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ResponsiveSwipeable);
