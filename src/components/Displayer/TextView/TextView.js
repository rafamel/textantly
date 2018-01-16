import React from 'react';
import { jss } from 'react-jss';
import { withState } from 'store/utils';
import classnames from 'classnames';
import config from 'config';
import ImageRender from '../ImageRender';
import styles from './TextView.styles';
import TextResizer from './TextResizer';

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        textEdits: state.edits.text,
        isRendering: state._loading.rendering
    })
);

class TextView extends React.Component {
    static propTypes = {
        ...storeTypes
    };
    state = { sizerRerun: 0 };
    styleSheet = jss.createStyleSheet(styles, { link: true });
    classes = this.styleSheet.classes;
    stylesUpdate = (updateObj = this.props.textEdits) => {
        this.styleSheet.update(updateObj).attach();
    };
    // Lifecycle
    componentWillReceiveProps(nextProps) {
        if (nextProps.isRendering) return;

        this.stylesUpdate(nextProps.textEdits);
        this.setState({ sizerRerun: this.state.sizerRerun + 1 });
    }
    componentWillMount() {
        this.stylesUpdate();
    }
    shouldComponentUpdate(nextProps) {
        return !nextProps.isRendering;
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
                    <div className={
                        classnames(classes.contain, classes.containPosition)
                    }>
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
