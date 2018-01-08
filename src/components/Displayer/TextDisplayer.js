import React from 'react';
import PropTypes from 'prop-types';

class Displayer extends React.Component {
    static propTypes = {
        // Props
        src: PropTypes.string.isRequired,
        textString: PropTypes.string.isRequired
    };
    render() {
        return (
            <div id="displayer">
                <div className="container">
                    <div id="img-container">
                        <img
                            src={this.props.src}
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

export default Displayer;
