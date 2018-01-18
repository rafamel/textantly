import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';

const styles = (theme) => ({
    tabs: {
        background: '#fff',
        marginLeft: -56,
        width: 'calc(100% + 56px)'
    }
});

class TopTabs extends React.Component {
    static propTypes = {
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        value: PropTypes.number,
        onChange: PropTypes.func,
        // JSS
        classes: PropTypes.object.isRequired
    };
    render() {
        const { classes, labels, value, onChange } = this.props;
        return (
            <Tabs
                value={(!value && value !== 0) ? false : value}
                classes={{ root: classes.tabs }}
                onChange={onChange}
                indicatorColor="primary"
                textColor="primary"
                scrollButtons="on"
                scrollable
                fullWidth
            >
                {labels.map((label, i) => (
                    <Tab
                        key={`${label}_${i}`}
                        label={label}
                    />
                ))}
            </Tabs>
        );
    }
}

export default withStyles(styles)(TopTabs);
