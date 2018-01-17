import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Editor from '../Editor/Editor';
import Navigation from '../Navigation';
import Displayer from '../Displayer/Displayer';
import HistoryButtons from './HistoryButtons';
import AppBar from 'material-ui/AppBar';
import TopBar from '../TopBar';

const drawerWidth = 350;
const appBarHeight = 64;
const styles = {
    frame: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    container: {
        maxWidth: `calc(100% - ${drawerWidth}px)`,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    appBar: {
        position: 'static',
        display: 'flex',
        flexDirection: 'row',
        boxShadow: 'none'
    },
    navigation: {
        width: drawerWidth
    },
    drawer: {
        height: `calc(100% - ${appBarHeight}px)`
    },
    drawerPaper: {
        height: '100%',
        width: 350,
        position: 'static',
        borderRight: '1px solid rgba(136, 136, 136, 0.16)'
    },
    displayer: {
        flexGrow: 1
    }
};

const DesktopUI = ({ classes }) => (
    <div className={classes.frame}>
        <div>
            <AppBar classes={{ root: classes.appBar }}>
                <Navigation className={classes.navigation} />
            </AppBar>
            <Drawer
                classes={{
                    docked: classes.drawer,
                    paper: classes.drawerPaper
                }}
                type="permanent"
                open
            >
                <Editor/>
            </Drawer>
        </div>
        <div className={classes.container}>
            <TopBar />
            <Displayer className={classes.displayer} />
            <HistoryButtons />
        </div>
    </div>
);

DesktopUI.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DesktopUI);
