import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import TextFormat from 'material-ui-icons/TextFormat';
import Image from 'material-ui-icons/Image';

const styles = {
    root: {
        marginBottom: 16
    },
    tab: {
        flexGrow: 1,
        maxWidth: 'none',
        minWidth: 90
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
        const { classes, mainView } = this.props;
        const viewIndex = this.tabDict.toIndex[mainView] || 0;
        const tabsProps = {
            indicatorColor: 'primary',
            textColor: 'primary'
        };
        return (
            <AppBar
                className={classes.root}
                position="static"
                color="inherit"
            >
                <Tabs
                    {...tabsProps}
                    value={viewIndex}
                    onChange={this.handleChange}
                >
                    <Tab
                        className={classes.tab}
                        label="Text"
                        icon={<TextFormat />}
                    />
                    <Tab
                        className={classes.tab}
                        label="Edit Image"
                        icon={<Image />}
                    />
                </Tabs>
            </AppBar>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(Navigation);
