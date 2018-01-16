import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import TextEditor from './TextEditor/TextEditor';
import ImageEditor from './ImageEditor/ImageEditor';
import ImageSelector from './ImageSelector/ImageSelector';

const imageSelectorHeight = 72;
const styles = {
    root: {
        margin: 0,
        height: `calc(100% - ${imageSelectorHeight}px)`
    },
    swipeable: {
        height: '100%',
        '& > div': {
            height: '100%'
        }
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
        className: PropTypes.string,
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
        const { theme, classes, className, mainView } = this.props;
        const viewIndex = this.tabDict.toIndex[mainView] || 0;
        return (
            <div className={classnames(classes.root, className)}>
                <SwipeableViews
                    className={classes.swipeable}
                    axis={(theme.direction === 'rtl') ? 'x-reverse' : 'x'}
                    index={viewIndex}
                    onChangeIndex={this.handleChange}
                    disabled
                >
                    <TextEditor />
                    <ImageEditor />
                </SwipeableViews>
                <ImageSelector />
            </div>
        );
    }
}

export default compose(
    withStyles(styles, { withTheme: true }),
    connector
)(Editor);
