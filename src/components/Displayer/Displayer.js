import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'store';
import TextOver from './TextOver/TextOver';
import ShowImage from './ShowImage';

const connector = connect(
    (state) => ({
        src: state.edits.src,
        mainView: state._activeViews.main,
        text: state.edits.text
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
        text: PropTypes.object.isRequired,
        // Actions
        changeSrc: PropTypes.func.isRequired,
        tempForget: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired
    };
    render() {
        const image = (
            <ShowImage
                src={this.props.src}
                changeSrc={this.props.changeSrc}
                tempForget={this.props.tempForget}
                addAlert={this.props.addAlert}
            />
        );

        const mainView = this.props.mainView;
        const display = (mainView && mainView === 'image')
            ? image
            : (
                <TextOver text={this.props.text}>
                    { image }
                </TextOver>
            );
        return (
            <div style={{ textAlign: 'center' }}>
                { display }
            </div>
        );
    }
};

export default connector(Displayer);
