import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { styles as appStyles } from 'styles';
import Button from 'material-ui/Button';
import Grade from 'material-ui-icons/Grade';

const styles = {
    root: {
        marginBottom: 32
    },
    contain: {
        display: 'flex',
        marginBottom: 12
    },
    h1: {
        ...appStyles.h1,
        margin: 'auto 0'
    },
    lead: {
        ...appStyles.lead,
        margin: 'auto 0'
    },
    button: {
        margin: `auto 15px auto 0`
    },
    buttonLabel: { color: 'rgba(255,255,255,.84)' }
};

const Header = ({ classes }) => (
    <div className={classes.root}>
        <div className={classes.contain}>
            <Button
                classes={{ label: classes.buttonLabel }}
                color="primary"
                className={classes.button}
                fab
            >
                <Grade />
            </Button>
            <h1 className={classes.h1}>
                Textantly
            </h1>
        </div>
        <p className={classes.lead}>
            Delicious morning coffee. A keystroke away.
        </p>
    </div>
);

Header.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
