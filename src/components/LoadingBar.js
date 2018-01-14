import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';

const styles = {
    root: {
        position: 'fixed',
        display: 'block',
        top: 0,
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
        loading: state._loading.loading,
        rendering: state._loading.rendering
    })
);

class LoadingBar extends React.Component {
    static propTypes = {
        ...storeTypes,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        _opacity: 1,
        _hidden: false,
        timeout: null
    };
    componentWillReceiveProps(nextProps) {
        const _opacity = Number(nextProps.loading || nextProps.rendering);
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
    render() {
        const { classes } = this.props;
        const style = {
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
