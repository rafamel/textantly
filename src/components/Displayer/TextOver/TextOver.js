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
        // State (Props)
        text: PropTypes.object.isRequired
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
    stylesUpdate = (updateObj = this.props.text) => {
        this.styleSheet.update(updateObj).attach();
    };
    // Font Size
    fontResize = fontResize.bind(this);
    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (nextProps.text) this.stylesUpdate(nextProps.text);
    }
    componentDidUpdate() {
        this.fontResize();
    }
    componentWillMount() {
        this.stylesUpdate();
    }
    componentDidMount() {
        const observer = new ResizeObserver(() => { this.fontResize(); });
        observer.observe(this.nodes.child);
        observer.observe(this.nodes.parent);
        this.fontResize();
    }
    render() {
        const classes = this.classes;
        const { text, children } = this.props;
        const textString = text.textString
            || config.defaults.text.textString;

        const position = text.overlayPosition;
        const length = (position === 'top' || position === 'bottom')
            ? { height: `${text.overlayHeight}%` }
            : { width: `${text.overlayWidth}%` };

        return (
            <div className={classes.root}>
                <div
                    className={
                        classnames(classes.overlay, classes.overlayPosition)
                    }
                    style={length}
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
