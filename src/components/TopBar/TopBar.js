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
import LoadingBar from './LoadingBar';

const barHeight = {
    mobile: 56,
    desktop: 64
};

const styles = (theme) => ({
    appBar: {
        position: 'static',
        boxShadow: 'none'
    },
    toolbar: {
        width: '100%',
        userSelect: 'none',
        padding: '0 16px 0 10px',
        minHeight: barHeight.desktop,
        height: barHeight.desktop,
        [theme.breakpoints._q.mobile]: {
            padding: '0 13px',
            minHeight: barHeight.mobile,
            height: barHeight.mobile
        }
    },
    title: {
        fontSize: 20,
        fontWeight: 300,
        lineHeight: 1.1,
        margin: 'auto 0'
    },
    subheading: {
        fontSize: 14,
        fontWeight: 300,
        lineHeight: 1.1,
        margin: '3px 0 1px',
        [theme.breakpoints._q.mobile]: {
            display: 'none'
        }
    },
    button: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,.75)',
        margin: `auto 12px auto 0`,
        boxShadow: 'none',
        cursor: 'auto',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,.95)'
        },
        [theme.breakpoints._q.mobile]: {
            height: 36,
            width: 36,
            marginRight: 10
        }
    },
    buttonLabel: { color: theme.palette.primary.main },
    github: {
        margin: 'auto 0 auto auto',
        height: 'auto',
        width: 'auto',
        fontSize: 30,
        opacity: 0.75,
        '&:hover': {
            opacity: 0.95
        }
    }
});

const TopBar = ({ classes, isMobile }) => (
    <AppBar
        classes={{ root: classes.appBar }}
        style={{ height: (isMobile) ? barHeight.mobile : barHeight.desktop }}
    >
        <LoadingBar top={(isMobile) ? barHeight.mobile : 0} />
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
                    classes={{ root: classes.title }}
                    type="title"
                    color="inherit"
                    noWrap
                >
                    Textantly
                </Typography>
                <Typography
                    classes={{ root: classes.subheading }}
                    type="subheading"
                    color="inherit"
                    noWrap
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
    isMobile: PropTypes.bool.isRequired,
    // JSS
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TopBar);
