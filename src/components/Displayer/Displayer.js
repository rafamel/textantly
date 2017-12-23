import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../store';

export default connect(
    (state) => ({
        src: state.image.src
    }), {
        revert: actions.image.revert
    }
)(class Displayer extends React.Component {
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
                                    <p>Your Text Here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
