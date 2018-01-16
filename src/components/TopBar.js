import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grade from 'material-ui-icons/Grade';
import IconButton from 'material-ui/IconButton';
import classnames from 'classnames';

const styles = (theme) => ({
    appBar: {
        position: 'static',
        display: 'flex',
        flexDirection: 'row',
        boxShadow: 'none'
    },
    toolbar: {
        userSelect: 'none',
        padding: '0 10px',
        width: '100%'
    },
    button: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,.65)',
        margin: `auto 12px auto 0`,
        boxShadow: 'none',
        cursor: 'auto',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,.9)'
        }
    },
    buttonLabel: { color: theme.palette.primary.main },
    github: {
        margin: 'auto 0 auto auto',
        height: 'auto',
        width: 'auto',
        fontSize: 30,
        opacity: 0.8,
        '&:hover': {
            opacity: 0.95
        }
    }
});

const TopBar = ({ classes }) => (
    <AppBar classes={{ root: classes.appBar }}>
        <Toolbar classes={{ root: classes.toolbar }}>
            <Button
                color="primary"
                classes={{
                    root: classes.button,
                    label: classes.buttonLabel
                }}
                fab
            >
                <Grade />
            </Button>
            <div>
                <Typography
                    type="title" color="inherit" noWrap
                >
                    Textantly
                </Typography>
                <Typography
                    type="subheading" color="inherit" noWrap
                >
                    Delicious morning coffee, a keystoke away
                </Typography>
            </div>

            <IconButton
                onClick={() => {
                    window.open('https://github.com/rafamel/textantly');
                }}
                color="contrast"
                className={classnames('fa fa-github', classes.github)}
            />
        </Toolbar>
    </AppBar>
);

TopBar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TopBar);
