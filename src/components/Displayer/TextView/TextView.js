import React from 'react';
import PropTypes from 'prop-types';
import { jss } from 'react-jss';
import classnames from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';
import config from 'config';
import ImageRender from '../ImageRender';
import fontResize from './font-resize';
import styles from './TextView.styles';

class TextView extends React.Component {
    static propTypes = {
        // State (Props)
        textEdits: PropTypes.object.isRequired
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
    setObserver = ({ unobserve } = {}) => {
        if (unobserve) {
            if (!this.observer.active) return;
            this.observer.active = false;
            this.observer.obj.unobserve(this.nodes.child);
            this.observer.obj.unobserve(this.nodes.parent);
        } else {
            if (this.observer.active) return;
            this.observer.active = true;
            this.observer.obj.observe(this.nodes.child);
            this.observer.obj.observe(this.nodes.parent);
        }
    };
    fontResize = () => {
        fontResize.call(this);
    };
    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (nextProps.textEdits) {
            this.stylesUpdate(nextProps.textEdits);
        }
    }
    componentDidUpdate() {
        this.fontResize();
    }
    componentWillMount() {
        this.stylesUpdate();
    }
    componentDidMount() {
        this.setObserver();
        this.fontResize();
    }
    componentWillUnmount() {
        this.setObserver({ unobserve: true });
    }
    render() {
        const classes = this.classes;
        const textEdits = this.props.textEdits;
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
                <ImageRender />
            </div>
        );
    }
};

export default TextView;
