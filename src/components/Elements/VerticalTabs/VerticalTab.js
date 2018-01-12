import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'material-ui/Tabs';
import classnames from 'classnames';
import { jss } from 'react-jss';

const IconLabel = (props) => {
    const { label, icon } = props;
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            { icon }
            <span style={{ margin: 'auto 0 auto 10px' }}>
                { label }
            </span>
        </div>
    );
};
IconLabel.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired
};

const styles = {
    labelContainer: {
        width: '100%'
    }
};

class VerticalTab extends React.Component {
    static propTypes = {
        ...Tab.propTypes,
        ...IconLabel.propTypes,
        classes: PropTypes.object
    };
    classes = jss.createStyleSheet(styles)
        .attach()
        .classes;
    render() {
        let { label, icon, classes } = this.props;
        if (!classes) classes = {};
        classes.labelContainer = (classes)
            ? classnames(this.classes.labelContainer, classes.labelContainer)
            : this.classes.labelContainer;

        if (icon !== undefined) {
            label = (
                <IconLabel
                    label={label}
                    icon={icon}
                />
            );
        }
        if (label !== undefined) icon = undefined;
        return (
            <div style={{
                width: '100%'
            }}>
                <Tab
                    style={{ width: '100%', maxWidth: 'none' }}
                    {...this.props}
                    label={label}
                    icon={icon}
                    classes={classes}
                />
            </div>
        );
    }
}

export {
    VerticalTab as default,
    IconLabel
};
