import React from 'react';
import PropTypes from 'prop-types';
import ImageRender from '../ImageRender';
import RotateView from './RotateView';

class ImageView extends React.Component {
    static propTypes = {
        // State
        activeViews: PropTypes.object.isRequired,
        imageEdits: PropTypes.object.isRequired
    };
    render() {
        const { activeViews, imageEdits } = this.props;

        switch (activeViews.image.main) {
        case 'rotate':
            return (
                <RotateView
                    rotate={imageEdits.rotate}
                    dimensions={activeViews.dimensions.canvas}
                />
            );
        default:
            return (<ImageRender />);
        }
    }
};

export default ImageView;
