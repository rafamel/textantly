import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import {
    CropSquare,
    CropFree
} from 'material-ui-icons';
import Icon from 'material-ui/Icon';

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

class CropEditor extends React.Component {
    static propTypes = {
        // State (Props)
        cropView: PropTypes.string,
        // Actions (Props)
        changeCropView: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    handleChange = (event, value) => {
        this.props.changeCropView(value);
    };
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

export default withStyles(styles)(CropEditor);
