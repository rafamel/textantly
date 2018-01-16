import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';
import TextFormat from 'material-ui-icons/TextFormat';
import Image from 'material-ui-icons/Image';

const styles = {
    tab: {
        flexGrow: 1,
        maxWidth: 'none',
        minWidth: 90,
        height: 64,
        width: '50%'
    },
    label: {
        paddingTop: 4,
        paddingBottom: 4
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        mainView: state._activeViews.main
    }), (actions) => ({
        changeMainView: actions._activeViews.changeMain,
        reset: actions.edits.reset,
        backwards: actions.edits.backwards,
        forwards: actions.edits.forwards
    })
);

class Navigation extends React.Component {
    static propTypes = {
        ...storeTypes,
        classname: PropTypes.string,
        // JSS
        classes: PropTypes.object.isRequired
    };
    tabDict = {
        toIndex: { text: 0, image: 1 },
        toString: { 0: 'text', 1: 'image' }
    };
    handleChange = (e, index) => {
        const view = this.tabDict.toString[index];
        this.props.changeMainView(view);
    };
    render() {
        const { classes, mainView, className } = this.props;
        const viewIndex = this.tabDict.toIndex[mainView] || 0;
        const tabClasses = {
            root: classes.tab,
            labelContainer: classes.label
        };

        return (
            <Tabs
                classes={{ root: className }}
                value={viewIndex}
                indicatorColor="rgba(255, 255, 255, 0.6)"
                onChange={this.handleChange}
            >
                <Tab
                    classes={tabClasses}
                    label="Text"
                    icon={<TextFormat />}
                />
                <Tab
                    classes={tabClasses}
                    label="Edit Image"
                    icon={<Image />}
                />
            </Tabs>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(Navigation);
