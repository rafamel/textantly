import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import { InputLabel } from 'material-ui/Input';

const styles = {
    root: {
        textAlign: 'left',
        transformOrigin: 'top left',
        transform: 'scale(0.75)',
        marginBottom: 5
    }
};

class FreeLabel extends React.Component {
    static propTypes = {
        label: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        // JSS
        classes: PropTypes.object.isRequired
    };
    render() {
        const { classes, className, style, label } = this.props;
        if (!label) return null;
        return (
            <div
                className={classnames(classes.root, className)}
                style={style}
            >
                <InputLabel>{label}</InputLabel>
            </div>
        );
    }
}

export default withStyles(styles)(FreeLabel);
