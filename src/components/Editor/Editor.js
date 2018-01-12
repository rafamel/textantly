import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import ResponsiveSwipeable from 'components/Elements/ResponsiveSwipeable';
import TextEditor from './TextEditor/TextEditor';
import ImageEditor from './ImageEditor/ImageEditor';

const styles = {
    root: {
        marginBottom: 48
    },
    editor: {
        padding: '14px 22px 18px'
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
        classes: PropTypes.object.isRequired
    };
    tabDict = {
        toIndex: { text: 0, image: 1 },
        toString: { 0: 'text', 1: 'image' }
    };
    handleChange(index) {
        const view = this.tabDict.toString[index];
        this.props.changeMainView(view);
    }
    render() {
        const { classes, mainView } = this.props;
        const viewIndex = this.tabDict.toIndex[mainView] || 0;
        return (
            <div className={classes.root}>
                <Paper>
                    <ResponsiveSwipeable
                        index={viewIndex}
                        onChangeIndex={this.handleChange}
                    >
                        <TextEditor className={classes.editor} />
                        <ImageEditor />
                    </ResponsiveSwipeable>
                </Paper>
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(Editor);
