import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import ArrowBack from 'material-ui-icons/ArrowBack';
import ArrowForward from 'material-ui-icons/ArrowForward';
import Restore from 'material-ui-icons/SettingsBackupRestore';

const styles = theme => ({
    root: {
        display: 'flex'
    },
    button: {
        margin: 0,
        flexGrow: 1,
        borderRadius: 0,
        boxShadow: 'none'
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    }
});

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        historyCan: state.edits._history.can
    }), (actions) => ({
        reset: actions.edits.reset,
        backwards: actions.edits.backwards,
        forwards: actions.edits.forwards
    })
);

class HistoryButtons extends React.Component {
    static propTypes = {
        ...storeTypes,
        // JSS
        classes: PropTypes.object.isRequired
    };
    render() {
        const { classes, historyCan, reset, backwards, forwards } = this.props;
        const buttonProps = {
            className: classes.button,
            raised: true,
            color: 'primary'
        };
        return (
            <div className={classes.root}>
                <Button
                    {...buttonProps}
                    onClick={backwards}
                    disabled={!historyCan.backwards}
                >
                    <ArrowBack className={classes.leftIcon} />
                    Undo
                </Button>
                <Button
                    {...buttonProps}
                    onClick={reset}
                >
                    <Restore />
                </Button>
                <Button
                    {...buttonProps}
                    onClick={forwards}
                    disabled={!historyCan.forwards}
                >
                    Redo
                    <ArrowForward className={classes.rightIcon} />
                </Button>
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(HistoryButtons);
