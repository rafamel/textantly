import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'store';
import config from 'config';

const connector = connect(
    (state) => ({
        src: state.edits.current.src.src,
        textString: state.edits.current.text.textString
            || config.defaults.text.textString
    }), {
        hardBackwards: actions.edits.hardBackwards,
        addAlert: actions.alerts.add
    }
);

class Displayer extends React.Component {
    static propTypes = {
        // State
        src: PropTypes.any.isRequired,
        textString: PropTypes.string.isRequired,
        // Actions
        hardBackwards: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired
    };
    state = {
        src: null
    };
    componentDidMount() {
        this.loadImage(this.props.src);
    }
    componentWillReceiveProps(nextProps) {
        this.loadImage(nextProps.src);
    }
    loadImage = (src) => {
        if (src === this.state.src) return;

        const img = new Image();
        img.src = src;
        img.onload = () => {
            // Load success
            this.setState({ src: src });
        };
        img.onerror = () => {
            // Load fail
            this.props.addAlert('Image could not be loaded');
            this.props.hardBackwards();
        };

    };
    render() {
        const image = (!this.state.src)
            ? null
            : (
                <img
                    src={this.state.src}
                    id="main-canvas"
                    alt="Main"
                />
            );
        return (
            <div id="displayer">
                <div className="container">
                    <div id="img-container"
                        style={
                            (!this.state.src) ? { opacity: 0 } : {}
                        }
                    >
                        { image }
                        <div id="text-container" className="left horizontal-bars">
                            <div>
                                <div>
                                    <p>{this.props.textString}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default connector(Displayer);
