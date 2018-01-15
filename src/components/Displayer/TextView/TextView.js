import React from 'react';
import PropTypes from 'prop-types';
import { jss } from 'react-jss';
import { withState, compose } from 'store/utils';
import withBroadcast from 'utils/withBroadcast';
import classnames from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';
import config from 'config';
import ImageRender from '../ImageRender';
import fontResize from './font-resize';
import styles from './TextView.styles';

const broadcaster = withBroadcast('freeze');
const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        textEdits: state.edits.text,
        isTempEdit: Boolean(state.edits._history.temp)
    })
);

class TextView extends React.Component {
    static propTypes = {
        ...storeTypes,
        freeze: PropTypes.bool
    };
    state = {
        textString: '',
        fontSize: 100
    };
    // Nodes
    nodes = {};
    styleSheet = jss.createStyleSheet(styles, { link: true });
    classes = this.styleSheet.classes;
    observer = {
        active: false,
        obj: new ResizeObserver(() => { this.fontResize(); })
    };
    setNode = (name) => (ref) => { this.nodes[name] = ref; };
    stylesUpdate = (updateObj = this.props.textEdits) => {
        this.styleSheet.update(updateObj).attach();
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
        if (this.props.freeze || this.props.isTempEdit) return;
        fontResize.call(this);
    };
    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (nextProps.freeze || nextProps.isTempEdit) return;
        this.stylesUpdate(nextProps.textEdits);
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
    shouldComponentUpdate(nextProps) {
        return !nextProps.freeze;
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
        const textOpacity = (this.props.isTempEdit) ? 0 : 1;
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
                                style={{
                                    fontSize: this.state.fontSize,
                                    opacity: textOpacity
                                }}
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
export default compose(
    broadcaster,
    connector
)(TextView);
