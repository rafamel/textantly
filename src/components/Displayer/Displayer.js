import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'store';
import config from 'config';

const connector = connect(
    (state) => ({
        src: state.image.src,
        textString: state.edits.current.text.textString
            || config.defaults.text.textString
    }), {
        revert: actions.image.revert
    }
);

class Displayer extends React.Component {
    static propTypes = {
        // State
        src: PropTypes.any.isRequired,
        textString: PropTypes.string.isRequired,
        // Actions
        revert: PropTypes.func.isRequired
    };
    imageHasLoaded = () => {
        console.log('LOADED');
    };
    imageHasFailed = () => {
        console.log('Failed!');
        this.props.revert();
    };
    render() {
        return (
            <div id="displayer">
                <div className="container">
                    <div id="img-container">
                        <img
                            src={this.props.src}
                            onLoad={this.imageHasLoaded}
                            onError={this.imageHasFailed}
                            id="main-canvas"
                            alt="Main"
                        />
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
