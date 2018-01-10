import React from 'react';
import PropTypes from 'prop-types';

class ShowImage extends React.Component {
    static propTypes = {
        // State (Props)
        src: PropTypes.object.isRequired,
        // Actions (Props)
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
        if (!this.state.src) return null;
        return (
            <img
                src={this.state.src}
                alt="Main"
            />
        );
    }
};

export default ShowImage;
