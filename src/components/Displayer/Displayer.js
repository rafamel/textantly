import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withState, compose } from 'store/utils';
import { Broadcast } from 'react-broadcast';
import { withStyles } from 'material-ui/styles';
import Downloader from './Downloader';
import ResizeObserver from 'resize-observer-polyfill';
import SwipeableViews from 'react-swipeable-views';
import TextView from './TextView/TextView';
import ImageView from './ImageView/ImageView';
import isEqual from 'lodash.isequal';

const styles = {
  root: {
    fontSize: 0,
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    overflow: 'hidden'
  },
  swipeable: {
    height: '100%',
    '& > div': {
      height: '100%',
      '& > div': {
        display: 'flex'
      }
    }
  },
  downloader: {
    position: 'absolute',
    right: 22,
    bottom: 22
  }
};

const { connector, propTypes: storeTypes } = withState(
  (state) => ({
    navMain: state.edits.navigation.main
  }),
  (actions) => ({
    setDimensions: actions.views.setDimensions
  })
);

class Displayer extends React.Component {
  static propTypes = {
    ...storeTypes,
    className: PropTypes.string,
    // JSS
    classes: PropTypes.object
  };
  state = {
    index: null,
    firstLoad: false
  };
  _isMounted = false;
  rootNode = null;
  lastDimensions = { width: 0, height: 0 };
  tabDict = {
    toIndex: { text: 0, image: 1 },
    toString: { 0: 'text', 1: 'image' }
  };
  observer = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    this.setDimensions({ width, height });
  });
  updateDimensions = () => {
    if (!this.rootNode) return;
    this.setDimensions({
      width: this.rootNode.clientWidth,
      height: this.rootNode.clientHeight
    });
  };
  setDimensions = (dimensions) => {
    if (!isEqual(dimensions, this.lastDimensions)) {
      this.lastDimensions = dimensions;
      this.props.setDimensions(dimensions);
    }
  };
  componentWillReceiveProps(nextProps) {
    const { navMain } = nextProps;
    if (this.props.navMain === navMain) return;
    this._updateOnNext = true;
  }
  componentDidUpdate() {
    if (!this._updateOnNext) return;
    this.updateDimensions();
    this.setState({ index: this.tabDict.toIndex[this.props.navMain] });
  }
  componentWillMount() {
    this.setState({ index: this.tabDict.toIndex[this.props.navMain] });
  }
  componentDidMount() {
    this._isMounted = true;
    window.addEventListener('resize', this.updateDimensions);
    this.observer.observe(this.rootNode);
    setTimeout(() => {
      if (this._isMounted) this.setState({ firstLoad: true });
    }, 2500);
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.observer.unobserve(this.rootNode);
    window.removeEventListener('resize', this.updateDimensions);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.navMain !== nextProps.navMain ||
      this.state.index !== nextState.index ||
      this.state.firstLoad !== nextState.firstLoad
    );
  }
  render() {
    const { classes, className, navMain } = this.props;

    const isNotActive = (which) => {
      return this.state.firstLoad && !(navMain === which);
    };

    return (
      <main
        ref={(ref) => {
          this.rootNode = ref;
        }}
        className={classnames(classes.root, className)}
      >
        <SwipeableViews
          className={classes.swipeable}
          index={this.state.index}
          springConfig={{ duration: '0s' }}
          disableLazyLoading={true}
          disabled
        >
          <Broadcast channel="freeze" value={isNotActive('text')}>
            <TextView />
          </Broadcast>
          <Broadcast channel="freeze" value={isNotActive('image')}>
            <ImageView />
          </Broadcast>
        </SwipeableViews>
        <Downloader className={classes.downloader} />
      </main>
    );
  }
}

export default compose(withStyles(styles), connector)(Displayer);
