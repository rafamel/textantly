import React from 'react';
import PropTypes from 'prop-types';
import { jss } from 'react-jss';
import classnames from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';
import config from 'config';
import styles from './TextOver.styles';
import fontResize from './font-resize';

class TextOver extends React.Component {
    static propTypes = {
        // Props
        children: PropTypes.element.isRequired,
        isActive: PropTypes.bool,
        // State (Props)
        textEdits: PropTypes.object.isRequired
    };
    static defaultProps = {
        isActive: true
    };
    state = {
        fontSize: 100
    };
    // Nodes
    nodes = {};
    setNode = (name) => (ref) => { this.nodes[name] = ref; };
    // JSS
    styleSheet = jss.createStyleSheet(styles, { link: true });
    classes = this.styleSheet.classes;
    stylesUpdate = (updateObj = this.props.textEdits) => {
        this.styleSheet.update(updateObj).attach();
    };
    // Font Reize
    observer = {
        active: false,
        obj: new ResizeObserver(() => { this.fontResize(); })
    };
    setObserver = (props = this.props) => {
        if (props.isActive) {
            if (this.observer.active) return;
            this.observer.active = true
            this.observer.obj.observe(this.nodes.child);
            this.observer.obj.observe(this.nodes.parent);
        } else {
            if (!this.observer.active) return;
            this.observer.active = false;
            this.observer.obj.unobserve(this.nodes.child);
            this.observer.obj.unobserve(this.nodes.parent);
        }
    };
    fontResize = () => {
        if (this.props.isActive) fontResize.call(this);
    };
    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (nextProps.textEdits) {
            this.stylesUpdate(nextProps.textEdits);
        }
        this.setObserver(nextProps);
    }
    componentDidUpdate() {
        this.fontResize();
    }
    componentWillMount() {
        if (this.props.isActive) this.stylesUpdate();
    }
    componentDidMount() {
        this.setObserver();
        this.fontResize();
    }
    render() {
        const classes = this.classes;
        const { textEdits, children } = this.props;
        const textString = textEdits.textString
            || config.defaults.text.textString;

        const position = textEdits.overlayPosition;
        const overlayStyle = (position === 'top' || position === 'bottom')
            ? { height: `${textEdits.overlayHeight}%` }
            : { width: `${textEdits.overlayWidth}%` };
        return (
            <div className={classes.root}>
                <div
                    className={
                        classnames(classes.overlay, classes.overlayPosition)
                    }
                    style={overlayStyle}
                >
                    <div
                        ref={this.setNode('parent')}
                        className={
                            classnames(classes.outer, classes.outerPosition)
                        }
                    >
                        <div
                            className={classes.inner}
                            ref={this.setNode('child')}
                        >
                            <p
                                className={classes.text}
                                style={{ fontSize: this.state.fontSize }}
                            >
                                {textString}
                            </p>
                        </div>
                    </div>
                </div>
                { children }
            </div>
        );
    }
};

export default TextOver;
