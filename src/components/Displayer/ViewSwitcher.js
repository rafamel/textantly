import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Broadcast } from 'react-broadcast';

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
        broadFreeze: PropTypes.bool,
        children: PropTypes
            .arrayOf(PropTypes.element)
            .isRequired,
        active: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        previous: null,
        current: null
    };
    currentNode = null;
    interval = null;
    changeOn = (newEl, ms) => {
        if (ms > 750) return true;

        const canvases = document.querySelectorAll(('canvas'));
        for (let canvas of canvases) {
            if (newEl.contains(canvas)) return true;
        }
    };
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
            const shouldChange = this.changeOn(
                this.currentNode, Date.now() - startAt
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
        const { classes, children, broadFreeze } = this.props;
        const { current, previous } = this.state;

        const activeChildren = children.map((child, i) => {
            const isActive = current === i || previous === i;
            const isFrozen = previous === i || broadFreeze;
            const setRef = (ref) => {
                if (current === i) this.currentNode = ref;
            };
            return (!isActive)
                ? null
                : (
                    <div
                        key={`view-${i}`}
                        ref={setRef}
                        className={classes.inner}
                    >
                        <Broadcast channel="freeze" value={isFrozen}>
                            { (isActive) ? child : null }
                        </Broadcast>
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
