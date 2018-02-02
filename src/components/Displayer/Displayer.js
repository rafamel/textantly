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
import isEqual from 'lodash.isequal';

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
        navMain: state.edits.navigation.main
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
    lastDimensions = { width: 0, height: 0 };
    observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        this.setDimensions({ width, height });
    });
    onResize = () => {
        if (!this.rootNode) return;
        this.setDimensions({
            width: this.rootNode.clientWidth,
            height: this.rootNode.clientHeight
        });
    };
    setDimensions = (dimensions) => {
        if (!isEqual(dimensions, this.lastDimensions)) {
            this.lastDimensions = dimensions;
            this.props.setDimensions(dimensions);
        }
    };
    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.observer.observe(this.rootNode);
    }
    componentWillUnmount() {
        this.observer.unobserve(this.rootNode);
        window.removeEventListener('resize', this.onResize);
    }
    render() {
        const { classes, className, navMain, loading, rendering } = this.props;

        const activeView = (!navMain || navMain !== 'image')
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
                        loading={loading || rendering}
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
