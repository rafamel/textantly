import React from 'react';
import PropTypes from 'prop-types';
import { jss } from 'react-jss';
import { withState, selectorWithType } from 'store/utils';
import classnames from 'classnames';
import config from 'config';
import { load as fontLoad } from 'services/fonts';
import ImageRender from './ImageRender';
import TextResizer from './TextResizer';
import styles from './TextView.styles';
import { selectors } from 'store';

const doUpdate = selectorWithType({
    propType: PropTypes.bool.isRequired,
    select: [
        state => selectors.edits.isTemp(state),
        state => state.views.isMobile
    ],
    result: (temp, isMobile) => {
        return (!isMobile || !temp);
    }
});

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        textEdits: state.edits.text,
        isRendering: state._loading.rendering,
        doUpdate: doUpdate(state)
    }), (actions) => ({
        addAlert: actions.alerts.add
    })
);

class TextView extends React.Component {
    static propTypes = {
        ...storeTypes,
        renderImage: PropTypes.bool,
        onLoad: PropTypes.func
    };
    static defaultProps = {
        renderImage: true
    };
    state = {
        opacity: 1
    };
    _isMounted = false;
    _fontResize = null;
    previousFailedFont = null;
    timeout = null;
    styleSheet = jss.createStyleSheet(styles, { link: true });
    classes = this.styleSheet.classes;
    stylesUpdate = (updateObj = this.props.textEdits) => {
        this.styleSheet.update(updateObj).attach();
    };
    fontResize = () => {
        if (!this._fontResize) return;
        this._fontResize();
        if (this.props.onLoad && this.state.opacity) this.props.onLoad();
    };
    loadFont = (fontFamily, previousFF, keepOpacity) => {
        if (!fontFamily
            || fontFamily === previousFF
            || fontFamily === this.previousFailedFont) {
            return;
        }
        if (!keepOpacity) this.setState({ opacity: 0 });
        fontLoad(fontFamily)
            .then(() => {
                if (!this._isMounted
                    || this.props.textEdits.fontFamily !== fontFamily) {
                    return;
                }

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
    onImageUpdate = () => this.fontResize();
    hookResizer = ({ fontResize }) => { this._fontResize = fontResize; };
    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (nextProps.isRendering) return;
        if (nextProps.doUpdate) this.stylesUpdate(nextProps.textEdits);

        this.loadFont(
            nextProps.textEdits.fontFamily, this.props.textEdits.fontFamily
        );
        this.fontResize();
    }
    componentWillMount() {
        this._isMounted = true;
        this.stylesUpdate();
        this.loadFont(this.props.textEdits.fontFamily, null, true);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !nextProps.isRendering && (
            this.props.textEdits.textString !== nextProps.textEdits.textString
            || this.state.opacity !== nextState.opacity
            || this.props.style !== nextProps.style
            || this.props.renderImage !== nextProps.renderImage
        );
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const { style, renderImage } = this.props;
        const classes = this.classes;
        const textString = this.props.textEdits.textString
            || config.defaults.text.textString;

        return (
            <div
                style={style}
                className={classnames(classes.root, classes.text)}
            >
                <div className={
                    classnames(classes.overlay, classes.overlayPosition)
                }>
                    <div
                        className={classnames(
                            classes.contain, classes.containPosition
                        )}
                        style={{ opacity: this.state.opacity }}
                    >
                        <TextResizer
                            text={textString}
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
