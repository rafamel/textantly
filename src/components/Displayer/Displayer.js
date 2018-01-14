import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import ResizeObserver from 'resize-observer-polyfill';
import ViewSwitcher from './ViewSwitcher';
import ImageRender from './ImageRender';
import TextView from './TextView/TextView';
import RotateView from './ImageViews/RotateView';

const styles = {
    root: {
        fontSize: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
    },
    view: {
        margin: 'auto'
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        isRendering: state._loading.rendering,
        activeViews: state._activeViews,
        textEdits: state.edits.text,
        imageEdits: state.edits.image
    })
);

class Displayer extends React.Component {
    static propTypes = {
        ...storeTypes,
        className: PropTypes.string,
        // JSS
        classes: PropTypes.object
    };
    rootNode = null;
    observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;

    });
    render() {
        const {
            classes,
            textEdits,
            imageEdits,
            className,
            isRendering
        } = this.props;

        const activeView = () => {
            const { main, image } = this.props.activeViews;
            if (!main || main !== 'image') {
                return 'text-view';
            }
            // Image Views
            switch (image.main) {
            case 'rotate':
                return 'rotate-view';
            default:
                return 'image-render-view';
            }
        };

        return (
            <main
                ref={(ref) => { this.rootNode = ref; }}
                className={classnames(classes.root, className)}
            >
                <div className={classes.view}>
                    <ViewSwitcher
                        active={activeView()}
                        isRendering={isRendering}
                    >
                        <TextView
                            key="text-view"
                            textEdits={textEdits}
                        />
                        <RotateView
                            key="rotate-view"
                            rotate={imageEdits.rotate}
                        />
                        <ImageRender
                            key="image-render-view"
                        />
                    </ViewSwitcher>
                </div>
            </main>
        );
    }
};

export default compose(
    withStyles(styles),
    connector
)(Displayer);
