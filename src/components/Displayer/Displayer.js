import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'store';
import config from 'config';
import TextDisplayer from './TextDisplayer';
import ImageDisplayer from './ImageDisplayer/ImageDisplayer';

const connector = connect(
    (state) => ({
        src: state.edits.src,
        mainView: state._activeViews.main,
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
        mainView: PropTypes.string,
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
        if (!this.state.src) return null;
        const mainView = this.props.mainView;
        return (!mainView || mainView === 'text')
            ? (
                <TextDisplayer
                    src={this.state.src}
                    textString={this.props.textString}
                />
            ) : (
                <ImageDisplayer
                    src={this.state.src}
                    mainView={this.props.mainView}
                />
            );
    }
};

export default connector(Displayer);
