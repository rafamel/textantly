import React from 'react';
import PropTypes from 'prop-types';
import { jss } from 'react-jss';
import { withState } from 'store/utils';
import classnames from 'classnames';
import config from 'config';
import { load as fontLoad } from 'services/fonts';
import ImageRender from './ImageRender';
import TextResizer from './TextResizer';
import styles from './TextView.styles';
import { selectors } from 'store';
import isEqual from 'lodash.isequal';

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        textEdits: state.edits.text,
        isRendering: state._loading.rendering,
        drawnDimensions: selectors.edits.image.dimensions.drawn(state)
    }), (actions) => ({
        addAlert: actions.alerts.add
    })
);

class TextView extends React.Component {
    static propTypes = {
        ...storeTypes,
        renderImage: PropTypes.bool,
        onReady: PropTypes.func
    };
    static defaultProps = {
        renderImage: true
    };
    state = {
        opacity: 1,
        fontSize: 0,
        innerHeight: 0
    };
    _checks = {
        image: false,
        font: false,
        sent: false
    };
    _isMounted = false;
    loadedFonts = [];
    previousFailedFont = null;
    timeout = null;
    styleSheet = jss.createStyleSheet(styles, { link: true });
    classes = this.styleSheet.classes;
    stylesUpdate = (updateObj = this.props.textEdits) => {
        this.styleSheet.update(updateObj).attach();
    };
    resizerSync = ({fontSize, inner}) => {
        this.readyChecks({ font: true });
        this.setState({ fontSize, innerHeight: inner.height });
    };
    fontResize = () => {};
    onImageUpdate = () => {
        this.readyChecks({ image: true });
        this.fontResize();
    };
    hookResizer = ({ fontResize }) => { this.fontResize = fontResize; };
    loadFont = (fontFamily, previousFF, keepOpacity) => {
        if (!fontFamily || fontFamily === previousFF
                || fontFamily === this.previousFailedFont) {
            return;
        }
        if (this.loadedFonts.includes(fontFamily)) {
            this.previousFailedFont = null;
            return;
        }
        if (!this.loadedFonts.length) {
            this.loadedFonts.push(fontFamily);
            return;
        }

        if (!keepOpacity) this.setState({ opacity: 0 });
        fontLoad(fontFamily)
            .then(() => {
                if (!this._isMounted
                    || this.props.textEdits.fontFamily !== fontFamily) {
                    return;
                }

                this.loadedFonts.push(fontFamily);
                this.previousFailedFont = null;
                this.fontResize();

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    if (this._isMounted) this.setState({ opacity: 1 });
                }, 250);
            })
            .catch(() => {
                this.previousFailedFont = fontFamily;
                this.props.addAlert(`Font could not be loaded. Do you have an active internet connection?`);
            });
    };
    readyChecks = ({ image, font, updated } = {}) => {
        const onReady = this.props.onReady;
        if (!onReady || this._checks.sent) return;

        if (image) this._checks.image = true;
        if (font && (!this.props.renderImage || this._checks.image)) {
            this._checks.text = true;
        }
        if (updated && this._checks.text) {
            this._checks.sent = true;
            onReady();
        }
    };
    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (nextProps.isRendering) return;
        if (this.props.isRendering !== nextProps.isRendering) {
            this.forceUpdate();
        }
        this.stylesUpdate(nextProps.textEdits);

        this.loadFont(
            nextProps.textEdits.fontFamily, this.props.textEdits.fontFamily
        );
        this.fontResize();
    }
    componentDidUpdate() {
        this.readyChecks({ updated: true });
    }
    componentWillMount() {
        this._isMounted = true;
        this.stylesUpdate();
        this.loadFont(this.props.textEdits.fontFamily, null, true);
    }
    shouldComponentUpdate(nextProps, nextState) {
        const textEdits = nextProps.textEdits;
        return !nextProps.isRendering && (
            !isEqual(this.state, nextState)
            || this.props.textEdits.textString !== textEdits.textString
            || this.props.textEdits.colorScheme !== textEdits.colorScheme
            || this.props.style !== nextProps.style
            || this.props.renderImage !== nextProps.renderImage
        );
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const classes = this.classes;
        const { opacity, fontSize, innerHeight } = this.state;
        const { style, renderImage, textEdits, drawnDimensions } = this.props;
        const { colorScheme, overlayPosition, overlayWidth } = textEdits;
        const textString = this.props.textEdits.textString
            || config.defaults.text.textString;

        const line = (
            !opacity
            || overlayPosition === 'top'
            || overlayPosition === 'bottom'
            || drawnDimensions.height < 200
            || (drawnDimensions.width * overlayWidth * 0.01) < 175
        )
            ? null
            : (
                <span
                    style={{ height: `calc(41% - ${innerHeight / 2}px)` }}
                    className={classnames({
                        [classes.line]: true,
                        'ln-dark': colorScheme === 'dark',
                        'ln-light': colorScheme === 'light'
                    })}
                >
                    <span style={{ height: fontSize * 0.06 }} />
                </span>
            );

        return (
            <div
                style={style}
                className={classnames(classes.root, classes.text)}
            >
                <div className={
                    classnames(classes.overlay, classes.overlayPosition)
                }>
                    {line}
                    {line}
                    <div
                        className={classnames(
                            classes.contain, classes.containPosition
                        )}
                        style={{ opacity }}
                    >
                        <TextResizer
                            text={textString}
                            onDone={this.resizerSync}
                            actions={this.hookResizer}
                        />
                    </div>
                </div>
                { renderImage && <ImageRender onUpdate={this.onImageUpdate} /> }
            </div>
        );
    }
};
export default connector(TextView);
