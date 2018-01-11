import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextLayer from './TextLayer/TextLayer';
import ImageRender from './ImageRender/ImageRender';
import RotateDisplay from './RotateDisplay';

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
        const display = (() => {
            if (!activeViews.main || activeViews.main !== 'image') {
                return (
                    <TextLayer textEdits={textEdits} />
                );
            }
            switch (activeViews.image) {
            case 'rotate':
                return (<RotateDisplay rotate={imageEdits.rotate}/>);
            default:
                return (<ImageRender />);
            }
        })();
        return (
            <div style={{ textAlign: 'center' }}>
                { display }
            </div>
        );
    }
};

export default connector(Displayer);
