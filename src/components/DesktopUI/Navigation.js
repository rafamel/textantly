import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import TextFormat from 'material-ui-icons/TextFormat';
import Image from 'material-ui-icons/Image';

const styles = {
    appBar: {
        position: 'static',
        boxShadow: 'none'
    },
    tab: {
        flexGrow: 1,
        maxWidth: 'none',
        minWidth: 90,
        width: '50%'
    },
    label: {
        paddingTop: 4,
        paddingBottom: 4
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        navMain: state.edits.navigation.main
    }), (actions) => ({
        setNavMain: actions.edits.navigation.setMain,
        reset: actions.edits.reset,
        backwards: actions.edits.backwards,
        forwards: actions.edits.forwards
    })
);

class Navigation extends React.Component {
    static propTypes = {
        ...storeTypes,
        height: PropTypes.number.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    tabDict = {
        toIndex: { text: 0, image: 1 },
        toString: { 0: 'text', 1: 'image' }
    };
    handleChange = (e, index) => {
        const view = this.tabDict.toString[index];
        this.props.setNavMain(view);
    };
    render() {
        const { classes, navMain, height } = this.props;
        const viewIndex = this.tabDict.toIndex[navMain] || 0;
        const tabProps = {
            classes: {
                root: classes.tab,
                labelContainer: classes.label
            },
            style: { height }
        };

        return (
            <AppBar
                classes={{ root: classes.appBar }}
                style={{ height }}
            >
                <Tabs
                    value={viewIndex}
                    indicatorColor="rgba(255, 255, 255, 0.6)"
                    onChange={this.handleChange}
                >
                    <Tab
                        {...tabProps}
                        label="Text"
                        icon={<TextFormat />}
                    />
                    <Tab
                        {...tabProps}
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
