import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import Icon from 'material-ui/Icon';
import CropSquare from 'material-ui-icons/CropSquare';
import CropFree from 'material-ui-icons/CropFree';

const styles = {
    root: {
        height: 62
    },
    button: {
        maxWidth: 125,
        '& > span > span:last-child': {
            paddingTop: 6
        }
    }
};

class CropSelector extends React.Component {
    static propTypes = {
        cropView: PropTypes.string,
        setImageViews: PropTypes.func.isRequired,
        active: PropTypes.bool,
        // JSS
        classes: PropTypes.object.isRequired
    };
    static defaultProps = {
        active: true
    };
    handleChange = (event, value) => {
        this.props.setImageViews({ crop: value });
    };
    shouldComponentUpdate(nextProps) {
        return nextProps.active;
    }
    render() {
        const { classes, cropView } = this.props;

        return (
            <BottomNavigation
                value={cropView || 'free'}
                onChange={this.handleChange}
                className={classes.root}
            >
                <BottomNavigationAction
                    label="Youtube"
                    value="youtube"
                    className={classes.button}
                    icon={
                        <Icon
                            className="fa fa-youtube"
                            style={{ fontSize: 17, paddingTop: 3 }}
                        />
                    }
                />
                <BottomNavigationAction
                    label="Facebook"
                    value="facebook"
                    className={classes.button}
                    icon={
                        <Icon
                            className="fa fa-facebook"
                            style={{ fontSize: 17, paddingTop: 3 }}
                        />
                    }
                />
                <BottomNavigationAction
                    label="Square"
                    value="square"
                    className={classes.button}
                    icon={<CropSquare />}
                />
                <BottomNavigationAction
                    label="Free"
                    value="free"
                    className={classes.button}
                    icon={<CropFree />}
                />
            </BottomNavigation>
        );
    }
}

export default withStyles(styles)(CropSelector);
