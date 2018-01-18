import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';

const styles = {
    root: {
        position: 'fixed',
        display: 'block',
        left: 0,
        right: 0,
        transition: 'opacity linear .75s',
        zIndex: 9999
    },
    bar: {
        height: '2.5px'
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        isMobile: state._activeViews.isMobile,
        loading: state._loading.loading,
        rendering: state._loading.rendering
    })
);

class LoadingBar extends React.Component {
    static propTypes = {
        ...storeTypes,
        top: PropTypes.number,
        // JSS
        classes: PropTypes.object.isRequired
    };
    static defaultProps = {
        top: 0
    };
    state = {
        _opacity: 1,
        _hidden: false,
        timeout: null
    };
    updateOpacity(props = this.props) {
        const _opacity = Number(props.loading || props.rendering);
        if (_opacity === this.state._opacity) return;

        if (this.state.timeout) clearTimeout(this.state.timeout);

        let timeout = null;
        if (_opacity === 0) {
            timeout = setTimeout(() => {
                if (this.state._opacity === 0) {
                    this.setState({ _hidden: true });
                }
            }, 1000);
        }

        this.setState({
            _opacity,
            _hidden: false,
            timeout
        });
    }
    componentWillReceiveProps(nextProps) {
        this.updateOpacity(nextProps);
    }
    componentWillMount() {
        this.updateOpacity();
    }
    componentWillUnmount() {
        if (this.state.timeout) clearTimeout(this.state.timeout);
    }
    render() {
        const { classes, top } = this.props;
        const style = {
            top,
            opacity: this.state._opacity,
            display: (this.state._hidden) ? 'none' : 'block'
        };
        return (
            <div
                className={classes.root}
                style={style}
            >
                <LinearProgress
                    color="accent"
                    className={classes.bar}
                />
            </div>
        );
    }
};

export default compose(
    withStyles(styles),
    connector
)(LoadingBar);
