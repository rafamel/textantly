import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import SaveIcon from 'material-ui-icons/Save';
import ResizeObserver from 'resize-observer-polyfill';
import ViewSwitcher from './ViewSwitcher';
import TextView from './TextView/TextView';
import ImageView from './ImageView/ImageView';

const styles = {
    root: {
        fontSize: 0,
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden'
    },
    view: {
        width: '100%',
        margin: 'auto'
    },
    saveButton: {
        position: 'absolute',
        bottom: 22,
        right: 22,
        boxShadow: 'none'
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        mainView: state.views.main,
        imageView: state.views.image
    }), (actions) => ({
        setDimensions: actions.views.setDimensions
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
        const { classes, className, mainView } = this.props;

        const activeView = (!mainView || mainView !== 'image')
            ? 'text-view'
            : 'image-view';

        return (
            <main
                ref={(ref) => { this.rootNode = ref; }}
                className={classnames(classes.root, className)}
            >
                <div className={classes.view}>
                    <ViewSwitcher
                        active={activeView}
                    >
                        <TextView key="text-view" />
                        <ImageView key="image-view" />
                    </ViewSwitcher>
                </div>
                <Button
                    raised
                    className={classes.saveButton}
                    aria-label="save"
                    fab
                >
                    <SaveIcon />
                </Button>
            </main>
        );
    }
};

export default compose(
    withStyles(styles),
    connector
)(Displayer);
