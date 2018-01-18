import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import TextEditor from './TextEditor/TextEditor';
import ImageEditor from './ImageEditor/ImageEditor';
import ImageSelector from './ImageSelector/ImageSelector';

const imageSelectorHeight = 72;
const styles = (theme) => ({
    root: {
        margin: 0,
        [theme.breakpoints._q.desktop]: {
            height: `calc(100% - ${imageSelectorHeight}px)`
        }
    },
    swipeable: {
        [theme.breakpoints._q.desktop]: {
            height: '100%',
            '& > div': {
                height: '100%'
            }
        }
    }
});

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        mainView: state._activeViews.main,
        isMobile: state._activeViews.isMobile
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
        const { theme, classes, mainView, isMobile } = this.props;
        const viewIndex = this.tabDict.toIndex[mainView] || 0;

        return (isMobile)
            ? (mainView === 'text') ? (<TextEditor />) : (<ImageEditor />)
            : (
                <div className={classes.root}>
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
