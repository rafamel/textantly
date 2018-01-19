import React from 'react';
import { jss } from 'react-jss';
import { withState } from 'store/utils';
import classnames from 'classnames';
import config from 'config';
import ImageRender from '../ImageRender';
import styles from './TextView.styles';
import { load as fontLoad } from 'services/fonts';
import TextResizer from './TextResizer';

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        textEdits: state.edits.text,
        isRendering: state._loading.rendering
    }), (actions) => ({
        addAlert: actions.alerts.add
    })
);

class TextView extends React.Component {
    static propTypes = {
        ...storeTypes
    };
    state = {
        opacity: 1,
        sizerRerun: 0
    };
    _isMounted = false;
    previousFailedFont = null;
    timeout = null;
    styleSheet = jss.createStyleSheet(styles, { link: true });
    classes = this.styleSheet.classes;
    stylesUpdate = (updateObj = this.props.textEdits) => {
        this.styleSheet.update(updateObj).attach();
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
                this.setState({ sizerRerun: this.state.sizerRerun + 1 });

                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    if (this._isMounted) this.setState({ opacity: 1 });
                }, 250);
            })
            .catch(() => {
                this.previousFailedFont = fontFamily;
                this.props.addAlert(`Font could not be loaded. \
                    Do you have an active internet connection?`);
            });
    };
    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (nextProps.isRendering) return;

        this.loadFont(
            nextProps.textEdits.fontFamily, this.props.textEdits.fontFamily
        );
        this.stylesUpdate(nextProps.textEdits);
        this.setState({ sizerRerun: this.state.sizerRerun + 1 });
    }
    componentWillMount() {
        this._isMounted = true;

        this.loadFont(this.props.textEdits.fontFamily, null, true);
        this.stylesUpdate();
    }
    shouldComponentUpdate(nextProps) {
        return !nextProps.isRendering;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const classes = this.classes;
        const textString = this.props.textEdits.textString
            || config.defaults.text.textString;
        return (
            <div className={classnames(classes.root, classes.text)}>
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
                            rerun={this.state.sizerRerun}
                        />
                    </div>
                </div>
                <ImageRender />
            </div>
        );
    }
};
export default connector(TextView);
