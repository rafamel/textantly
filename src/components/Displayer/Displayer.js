import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextView from './TextView/TextView';
import ImageView from './ImageView/ImageView';

const connector = connect(
    (state) => ({
        activeViews: state._activeViews,
        textEdits: state.edits.text,
        imageEdits: state.edits.image
    })
);

class Displayer extends React.Component {
    static propTypes = {
        // State
        activeViews: PropTypes.object.isRequired,
        textEdits: PropTypes.object.isRequired,
        imageEdits: PropTypes.object.isRequired
    };
    render() {
        const { activeViews, textEdits, imageEdits } = this.props;
        const view = (activeViews.main && activeViews.main === 'image')
            ? (
                <ImageView
                    activeViews={activeViews}
                    imageEdits={imageEdits}
                />
            ) : (
                <TextView textEdits={textEdits} />
            );

        return (
            <div style={{ textAlign: 'center' }}>
                { view }
            </div>
        );
    }
};

export default connector(Displayer);
