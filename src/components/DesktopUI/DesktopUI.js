import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Editor from '../Editor/Editor';
import Displayer from '../Displayer/Displayer';
import TopBar from '../TopBar/TopBar';
import Navigation from './Navigation';
import HistoryButtons from './HistoryButtons';

const barHeight = 64;
const drawerWidth = 350;
const styles = {
  frame: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    width: drawerWidth
  },
  right: {
    maxWidth: `calc(100% - ${drawerWidth}px)`,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  drawer: {
    height: `calc(100% - ${barHeight}px)`
  },
  drawerPaper: {
    height: '100%',
    width: drawerWidth,
    position: 'static',
    borderRight: '1px solid rgba(136, 136, 136, 0.16)'
  },
  displayer: {
    flexGrow: 1
  }
};

const DesktopUI = ({ classes }) => (
  <div className={classes.frame}>
    <div className={classes.left}>
      <Navigation height={barHeight} />
      <Drawer
        classes={{
          docked: classes.drawer,
          paper: classes.drawerPaper
        }}
        type="permanent"
        open
      >
        <Editor />
      </Drawer>
    </div>
    <div className={classes.right}>
      <TopBar isMobile={false} />
      <Displayer className={classes.displayer} />
      <HistoryButtons />
    </div>
  </div>
);

DesktopUI.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DesktopUI);
