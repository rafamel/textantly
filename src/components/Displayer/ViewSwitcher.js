import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Broadcast } from 'react-broadcast';

const styles = () => ({
    root: {
        width: '100%'
    },
    outer: {
        width: '200%',
        display: 'flex'
    },
    inner: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column'
    }
});

class ViewSwitcher extends React.Component {
    static propTypes = {
        children: PropTypes
            .arrayOf(PropTypes.element)
            .isRequired,
        active: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        loading: PropTypes.bool,
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
        if (ms > 1000) return [true, 0];
        if (this.props.loading) return [false];

        const canvases = document.querySelectorAll('canvas');
        const images = document.querySelectorAll('img');
        for (let canvas of canvases) {
            if (newEl.contains(canvas)) return [true, 50];
        }
        for (let image of images) {
            if (newEl.contains(image)) return [true, 150];
        }
        return [false];
    };
    updateCurrent = (props = this.props) => {
        if (props.active === this.state.current) return;

        let active = props.active;
        if (typeof props.active === 'string') {
            active = React.Children.map(props.children, x => x.key)
                .indexOf(props.active);
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
            const [shouldChange, timeout] = this.changeOn(
                this.currentNode, Date.now() - startAt
            );
            if (shouldChange) {
                clearInterval(this.interval);
                setTimeout(() => {
                    if (this._isMounted) this.setState({ previous: null });
                }, timeout);
            }
        }, 25);
    };
    componentWillReceiveProps(nextProps) {
        this.updateCurrent(nextProps);
    }
    componentWillMount() {
        this._isMounted = true;
        this.updateCurrent();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const { classes, children } = this.props;
        const { current, previous } = this.state;

        const activeChildren = React.Children.map(children, (child, i) => {
            const isActive = current === i || previous === i;
            const isFrozen = previous === i;
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
