import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'store';
import TextOver from './TextOver/TextOver';
import ImageDisplayer from './ImageDisplayer/ImageDisplayer';

const connector = connect(
    (state) => ({
        src: state.edits.src,
        mainView: state._activeViews.main,
        textEdits: state.edits.text,
        imageEdits: state.edits.image
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
        textEdits: PropTypes.object.isRequired,
        imageEdits: PropTypes.object.isRequired,
        // Actions
        changeSrc: PropTypes.func.isRequired,
        tempForget: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired
    };
    render() {
        const mainView = this.props.mainView;
        const image = (
            <ImageDisplayer
                src={this.props.src}
                imageEdits={this.props.imageEdits}
                changeSrc={this.props.changeSrc}
                tempForget={this.props.tempForget}
                addAlert={this.props.addAlert}
            />
        );
        return (
            <div style={{ textAlign: 'center' }}>
                {
                    (!mainView || mainView !== 'image')
                        ? (
                            <TextOver
                                textEdits={this.props.textEdits}
                            >
                                {image}
                            </TextOver>
                        ) : image
                }
            </div>
        );
    }
};

export default connector(Displayer);
