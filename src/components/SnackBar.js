import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import config from 'config';

const styles = (theme) => ({
  root: {
    [theme.breakpoints._q.desktop]: {
      minWidth: 450,
      '& > *': {
        maxWidth: '100%'
      }
    }
  },
  contentRoot: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textShadow: '1px 1px rgba(0, 0, 0, 0.1)',
    padding: '6px 24px 6px 30px',
    width: '100%'
  },
  contentMessage: {
    textShadow: '1px 1px rgba(0, 0, 0, 0.1)',
    width: 'calc(100% - 48px)'
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  }
});

const { connector, propTypes: storeTypes } = withState(
  (state) => ({
    current: state.alerts.current
  }),
  (actions) => ({
    closeCurrent: actions.alerts.closeCurrent
  })
);

class SnackBar extends React.Component {
  static propTypes = {
    ...storeTypes,
    // JSS
    classes: PropTypes.object.isRequired
  };
  state = {
    _isOpen: Boolean(this.props.current)
  };
  handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    this.setState({ _isOpen: false });
    this.props.closeCurrent();
  };
  componentWillReceiveProps(nextProps) {
    const shouldOpen = Boolean(nextProps.current);
    if (this.state._isOpen !== shouldOpen) {
      this.setState({ _isOpen: false });
    }
    if (shouldOpen) {
      setTimeout(() => {
        this.setState({ _isOpen: true });
      }, 350);
    }
  }
  render() {
    const { classes, current } = this.props;
    if (!this.state._isOpen) return null;
    return (
      <Snackbar
        classes={{ root: classes.root }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={this.state._isOpen}
        autoHideDuration={config.snackbarDuration}
        onClose={this.handleClose}
        SnackbarContentProps={{
          classes: {
            root: classes.contentRoot,
            message: classes.contentMessage
          },
          'aria-describedby': 'message-id'
        }}
        transition={(props) => <Slide direction="up" {...props} />}
        message={<span id="message-id">{current.alert}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

export default compose(withStyles(styles), connector)(SnackBar);
