import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'material-ui/Tabs';
import classnames from 'classnames';
import { jss } from 'react-jss';

const IconLabel = (props) => {
  const { label, icon } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {icon}
      <span style={{ margin: 'auto 0 auto 10px' }}>{label}</span>
    </div>
  );
};
IconLabel.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired
};

const styles = {
  root: {
    width: '100%',
    maxWidth: 'none'
  },
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
  static _isVerticalTab = true;
  classes = jss.createStyleSheet(styles).attach().classes;
  render() {
    let { label, icon, classes } = this.props;

    classes = !classes
      ? {
          root: this.classes.root,
          labelContainer: this.classes.labelContainer
        }
      : {
          root: classnames(this.classes.root, classes.root),
          labelContainer: classnames(
            this.classes.labelContainer,
            classes.labelContainer
          )
        };

    if (icon !== undefined) {
      label = <IconLabel label={label} icon={icon} />;
    }
    if (label !== undefined) icon = undefined;
    return <Tab {...this.props} label={label} icon={icon} classes={classes} />;
  }
}

export { VerticalTab as default, IconLabel };
