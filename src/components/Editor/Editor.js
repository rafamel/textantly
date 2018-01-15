import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import TextEditor from './TextEditor/TextEditor';
import ImageEditor from './ImageEditor/ImageEditor';

const styles = {
    root: {
        marginBottom: 48
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        mainView: state._activeViews.main
    }), (actions) => ({
        changeMainView: actions._activeViews.changeMain
    })
);

class Editor extends React.Component {
    static propTypes = {
        ...storeTypes,
        // JSS
        theme: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired
    };
    tabDict = {
        toIndex: { text: 0, image: 1 },
        toString: { 0: 'text', 1: 'image' }
    };
    handleChange = (index) => {
        const view = this.tabDict.toString[index];
        this.props.changeMainView(view);
    };
    render() {
        const { theme, classes, mainView } = this.props;
        const viewIndex = this.tabDict.toIndex[mainView] || 0;
        return (
            <div className={classes.root}>

                <SwipeableViews
                    axis={(theme.direction === 'rtl') ? 'x-reverse' : 'x'}
                    index={viewIndex}
                    animateHeight={true}
                    onChangeIndex={this.handleChange}
                >
                    <TextEditor />
                    <ImageEditor />
                </SwipeableViews>
            </div>
        );
    }
}

export default compose(
    withStyles(styles, { withTheme: true }),
    connector
)(Editor);
