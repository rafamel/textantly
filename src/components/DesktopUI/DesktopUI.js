import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Editor from '../Editor/Editor';
import Navigation from '../Navigation';
import Displayer from '../Displayer/Displayer';
import HistoryButtons from './HistoryButtons';

const drawerWidth = 350;
const styles = {
    frame: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    container: {
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
        width: 350,
        position: 'static',
        borderRight: '1px solid rgba(136, 136, 136, 0.16)'
    },
    displayer: {
        flexGrow: 1
    }
};

class Container extends React.Component {
    static propTypes = {
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        mobileOpen: false
    };
    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.frame}>
                <div>
                    <AppBar classes={{ root: classes.appBar }}>
                        <Navigation className={classes.navigation} />
                    </AppBar>
                    <Drawer
                        classes={{ paper: classes.drawer }}
                        type="permanent"
                        open
                    >
                        <Editor />
                    </Drawer>
                </div>
                <div className={classes.container}>
                    <AppBar classes={{ root: classes.appBar }}>
                        <Toolbar>
                            <Typography type="title" color="inherit" noWrap>
                                Textantly
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Displayer className={classes.displayer} />
                    <HistoryButtons />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Container);
