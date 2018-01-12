import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import ViewSwitcher from './ViewSwitcher';
import ImageRender from './ImageRender';
import TextView from './TextView/TextView';
import RotateView from './ImageViews/RotateView';

const styles = {
    root: {
        width: '100%',
        textAlign: 'center'
    }
};

const connector = connect(
    (state) => ({
        activeViews: state._activeViews,
        textEdits: state.edits.text,
        imageEdits: state.edits.image
    })
);

class Displayer extends React.Component {
    static propTypes = {
        // State
        activeViews: PropTypes.object.isRequired,
        textEdits: PropTypes.object.isRequired,
        imageEdits: PropTypes.object.isRequired,
        // JSS
        classes: PropTypes.object
    };
    getActive = () => {
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
    render() {
        const { classes, textEdits, imageEdits } = this.props;
        return (
            <div className={classes.root}>
                <ViewSwitcher
                    active={this.getActive()}
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
        );
    }
};

export default compose(
    withStyles(styles),
    connector
)(Displayer);
