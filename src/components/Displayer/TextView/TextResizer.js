import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ResizeObserver from 'resize-observer-polyfill';
import fontResize, { setPhase } from './font-resize';

const styles = {
    outer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        flexGrow: 1
    },
    inner: {
        margin: 'auto'
    },
    p: {
        display: 'block',
        margin: '-0.125em 0 0',
        padding: 0,
        lineHeight: 0.9,
        userSelect: 'none'
    }
};

class TextResizer extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        rerun: PropTypes.number,
        // JSS
        classes: PropTypes.object.isRequired
    };
    current = { up: null, phase: 0, fontSize: 100 };
    nodes = { outer: null, inner: null, text: null };
    fontResize = fontResize.bind(this);
    observer = new ResizeObserver(() => { this.fontResize(); });
    setNode = (name) => (ref) => { this.nodes[name] = ref; };
    setObserver = ({ unobserve } = {}) => {
        if (unobserve) {
            this.observer.unobserve(this.nodes.inner);
            this.observer.unobserve(this.nodes.outer);
        } else {
            this.observer.observe(this.nodes.inner);
            this.observer.observe(this.nodes.outer);
        }
    };
    setText = (text) => {
        if (!this.nodes.text) return;
        this.nodes.text.textContent = text;
        setPhase.call(this, 0);
        this.fontResize();
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.text !== this.props.text) {
            this.setText(nextProps.text);
        }
        if (nextProps.rerun !== this.props.rerun) {
            this.fontResize();
        }
    }
    componentDidMount() {
        this.setObserver();
        this.fontResize();
    }
    componentWillUnmount() {
        this.setObserver({ unobserve: true });
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {
        const classes = this.props.classes;
        return (
            <div
                ref={this.setNode('outer')}
                className={classes.outer}
            >
                <div
                    className={classes.inner}
                    ref={this.setNode('inner')}
                >
                    <p
                        className={classes.p}
                        ref={this.setNode('text')}
                        style={{ fontSize: this.current.fontSize }}
                    >
                        {this.props.text}
                    </p>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(TextResizer);
