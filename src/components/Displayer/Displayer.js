import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import ResizeObserver from 'resize-observer-polyfill';
import ViewSwitcher from './ViewSwitcher';
import ImageRender from './ImageRender';
import TextView from './TextView/TextView';

const styles = {
    root: {
        fontSize: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
    },
    view: {
        width: '100%',
        margin: 'auto'
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        mainView: state._activeViews.main,
        imageView: state._activeViews.image
    }), (actions) => ({
        setDimensions: actions._activeViews.setDimensions
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
        this.props.setDimensions({ width, height });
    });
    componentDidMount() {
        this.observer.observe(this.rootNode);
    }
    componentWillUnmount() {
        this.observer.unobserve(this.rootNode);
    }
    render() {
        const { classes, className } = this.props;

        const activeView = () => {
            const { mainView, imageView } = this.props;
            if (!mainView || mainView !== 'image') {
                return 'text-view';
            }
            // Image Views
            switch (imageView.main) {
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
                    >
                        <TextView key="text-view" />
                        <ImageRender key="image-render-view" />
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
