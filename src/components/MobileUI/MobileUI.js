import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Displayer from '../Displayer/Displayer';
import MobileMenu from './MobileMenu';
import Editor from '../Editor/Editor';
import TopBar from '../TopBar/TopBar';

const styles = {
  frame: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  displayer: {
    margin: '2px 0 1px',
    flexGrow: 1
  }
};

const MobileUI = ({ classes }) => (
  <div className={classes.frame}>
    <TopBar isMobile={true} />
    <Paper>
      <Editor />
    </Paper>
    <Displayer className={classes.displayer} />
    <MobileMenu />
  </div>
);

MobileUI.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MobileUI);
