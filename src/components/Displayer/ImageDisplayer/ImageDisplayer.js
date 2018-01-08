import React from 'react';
import PropTypes from 'prop-types';

class Displayer extends React.Component {
    static propTypes = {
        // Props
        src: PropTypes.string.isRequired,
        mainView: PropTypes.string
    };
    render() {
        return (
            <div>
                <img
                    src={this.props.src}
                    alt="Main"
                />
            </div>
        );
    }
};

export default Displayer;
