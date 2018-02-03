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
        navMain: state.edits.navigation.main,
        isMobile: state.views.isMobile
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
    render() {
        const { theme, classes, navMain, isMobile } = this.props;

        return (isMobile)
            ? (navMain === 'text') ? (<TextEditor />) : (<ImageEditor />)
            : (
                <div className={classes.root}>
                    <SwipeableViews
                        className={classes.swipeable}
                        axis={(theme.direction === 'rtl') ? 'x-reverse' : 'x'}
                        index={this.tabDict.toIndex[navMain]}
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
