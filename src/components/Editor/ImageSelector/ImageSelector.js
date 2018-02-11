import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';
import FolderOpen from 'material-ui-icons/FolderOpen';
import Public from 'material-ui-icons/Public';
import ImageOpener from './ImageOpener';

const styles = (theme) => ({
  root: {
    width: '100%'
  },
  tab: {
    maxWidth: 'none'
  },
  hide: {
    display: 'none'
  }
});

const { connector, propTypes: storeTypes } = withState((state) => ({
  sourceFrom: state.edits.source.from
}));

class ImageSelector extends React.Component {
  static propTypes = {
    ...storeTypes,
    // Style
    className: PropTypes.string,
    style: PropTypes.object,
    // JSS
    classes: PropTypes.object.isRequired
  };
  state = {
    value: false
  };
  lock = false;
  openTimeout = null;
  tabDict = {
    toIndex: { file: 0, url: 1 },
    toString: { 0: 'file', 1: 'url' }
  };
  unlockSyncTab = (props = this.props) => {
    this.lock = false;
    this.setState({ value: props.sourceFrom });
  };
  handleTabChange = (event, index) => {
    const value = this.tabDict.toString[index];
    this.lock = true;
    this.setState({ value });

    clearTimeout(this.openTimeout);
    const openTimeout = setTimeout(() => {
      if (!this._isMounted) return;

      this.unlockSyncTab();
      if (value === 'file') this.openFile();
      else if (value === 'url') this.openUrl();
    }, 350);

    this.openTimeout = openTimeout;
  };
  hookOpener = ({ openFile, openUrl }) => {
    this.openFile = openFile;
    this.openUrl = openUrl;
  };
  componentWillReceiveProps(nextProps) {
    if (!this.lock && this.state.value !== nextProps.sourceFrom) {
      this.unlockSyncTab(nextProps);
    }
  }
  componentWillMount() {
    this._isMounted = true;
    this.unlockSyncTab();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const { classes, className, style } = this.props;
    let tabIndex = this.tabDict.toIndex[this.state.value];
    if (tabIndex == null) tabIndex = false;

    return (
      <div className={classnames(classes.root, className)} style={style}>
        <ImageOpener actions={this.hookOpener} />
        <Tabs
          value={tabIndex}
          onChange={this.handleTabChange}
          fullWidth
          indicatorColor="none"
          textColor="primary"
        >
          <Tab
            icon={<FolderOpen />}
            label="File"
            classes={{ root: classes.tab }}
          />
          <Tab icon={<Public />} label="URL" classes={{ root: classes.tab }} />
        </Tabs>
      </div>
    );
  }
}

export default compose(withStyles(styles), connector)(ImageSelector);
