import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'store';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import config from 'config';

const styles = theme => ({
    root: {
        width: '100',
        left: 0,
        right: 0,
        transform: 'none',
        '& > *': {
            width: '100%'
        }
    },
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4
    }
});

const connector = connect(
    (state) => ({
        current: state.alerts.current
    }), {
        closeCurrent: actions.alerts.closeCurrent
    }
);

class SnackBar extends React.Component {
    static propTypes = {
        // State
        current: PropTypes.string,
        // Actions
        closeCurrent: PropTypes.func.isRequired,
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
        return (
            <Snackbar
                className={classes.root}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={this.state._isOpen}
                autoHideDuration={config.snackbarDuration}
                onClose={this.handleClose}
                SnackbarContentProps={{
                    style: {
                        width: '100%'
                    },
                    'aria-describedby': 'message-id'
                }}
                transition={(props) => <Slide direction="up" {...props} />}
                message={<span id="message-id">{current}</span>}
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

export default compose(
    withStyles(styles),
    connector
)(SnackBar);
