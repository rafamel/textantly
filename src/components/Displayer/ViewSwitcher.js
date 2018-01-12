import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
    root: {
        overflow: 'hidden',
        width: '100%'
    },
    outer: {
        width: '200%',
        display: 'flex'
    },
    inner: {
        width: '50%'
    }
});

class ViewSwitcher extends React.Component {
    static propTypes = {
        // Props
        children: PropTypes.arrayOf(PropTypes.element).isRequired,
        active: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        changeOn: PropTypes.func,
        // JSS
        classes: PropTypes.object.isRequired
    };
    static defaultProps = {
        changeOn: (element, ms) => (element.clientHeight || ms > 750)
    };
    state = {
        previous: null,
        current: null
    };
    currentNode = null;
    interval = null;
    updateCurrent = (props = this.props) => {
        if (props.active === this.state.current) return;

        let active = props.active;
        if (typeof props.active === 'string') {
            active = props.children.map(x => x.key).indexOf(props.active);
            if (active === -1) active = null;
            if (active === this.state.current) return;
        }

        this.currentNode = null;
        if (this.interval) clearInterval(this.interval);
        if (this.state.previous != null) {
            this.setState({ current: active });
        } else {
            this.setState({
                current: active,
                previous: this.state.current
            });
        }

        const startAt = Date.now();
        this.interval = setInterval(() => {
            if (!this.currentNode) return;
            const shouldChange = props.changeOn(
                this.currentNode, (Date.now() - startAt)
            );
            if (shouldChange) {
                clearInterval(this.interval);
                this.setState({ previous: null });
            }
        }, 25);
    };
    componentWillReceiveProps(nextProps) {
        this.updateCurrent(nextProps);
    }
    componentWillMount() {
        this.updateCurrent();
    }
    render() {
        const { classes, children } = this.props;
        const { current, previous } = this.state;

        const activeChildren = children.map((child, i) => {
            const isActive = current === i || previous === i;
            return (!isActive)
                ? null
                : (
                    <div
                        ref={(ref) => {
                            if (current === i) this.currentNode = ref;
                        }}
                        key={`${classes.root}_${i}`}
                        className={classes.inner}
                    >
                        { (isActive) ? child : null }
                    </div>
                );
        });
        const flexDirection = (previous == null || current >= previous)
            ? 'row'
            : 'row-reverse';
        return (
            <div className={classes.root}>
                <div
                    className={classes.outer}
                    style={{ flexDirection }}
                >
                    { activeChildren }
                </div>
            </div>
        );
    }
};

export default withStyles(styles)(ViewSwitcher);
