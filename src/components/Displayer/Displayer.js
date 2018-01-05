import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'store';
import config from 'config';

const connector = connect(
    (state) => ({
        src: state.edits.src,
        textString: state.edits.text.textString
            || config.defaults.text.textString
    }), {
        tempForget: actions.edits.tempForget,
        changeSrc: actions.edits.changeSrc,
        addAlert: actions.alerts.add
    }
);

class Displayer extends React.Component {
    static propTypes = {
        // State
        src: PropTypes.object.isRequired,
        textString: PropTypes.string.isRequired,
        // Actions
        changeSrc: PropTypes.func.isRequired,
        tempForget: PropTypes.func.isRequired,
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
        if (src.src === this.state.src) return;

        const img = new Image();
        img.src = src.src;
        img.onload = () => {
            // Load success
            this.setState({ src: src.src });
            this.props.changeSrc(src);
        };
        img.onerror = () => {
            // Load fail
            this.props.addAlert('Image could not be loaded');
            this.props.tempForget();
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
