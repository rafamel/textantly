import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'store';
import VerticalTabs, { VerticalTab } from 'components/Elements/VerticalTabs';
import { Collapse } from 'react-collapse';
import Crop from 'material-ui-icons/Crop';
import Flip from 'material-ui-icons/Flip';
import Rotate90DegreesCcw from 'material-ui-icons/Rotate90DegreesCcw';
import PhotoSizeSelectLarge from 'material-ui-icons/PhotoSizeSelectLarge';
import CropSelector from './Fields/CropSelector';
import RotateSlider from './Fields/RotateSlider';

const connector = connect(
    (state) => ({
        image: state.edits.image,
        imageViews: state._activeViews.image,
        canvasDimensions: state._activeViews.dimensions.canvas
    }), {
        changeImageViews: actions._activeViews.changeImage,
        changeImage: actions.edits.changeImage,
        changeImageTemp: actions.edits.changeImageTemp
    }
);

class ImageEditor extends React.Component {
    static propTypes = {
        // State
        image: PropTypes.object,
        imageViews: PropTypes.object.isRequired,
        // Actions
        changeImageViews: PropTypes.func.isRequired,
        changeImage: PropTypes.func.isRequired,
        changeImageTemp: PropTypes.func.isRequired
    };
    state = {
        activeIndex: 0
    };
    lockIndex = false;
    tabDict = {
        toIndex: { crop: 0, rotate: 1, resize: 2, flip: 3, null: false },
        toString: { 0: 'crop', 1: 'rotate', 2: 'resize', 3: 'flip', false: null }
    };
    setActiveIndex = (props = this.props) => {
        if (this.lockIndex) return;
        const imageIndex = this.tabDict.toIndex[props.imageViews.main];
        if (imageIndex === this.state.activeIndex) return;
        this.setState({ activeIndex: imageIndex });
    };
    doFlip = () => {
        this.lockIndex = true;
        this.setState({ activeIndex: this.tabDict.toIndex.flip });

        this.props.changeImage({
            flip: !this.props.image.flip
        });

        setTimeout(() => {
            this.lockIndex = false;
            this.setActiveIndex();
        }, 400);
    };
    handleChange = (e, index) => {
        const view = this.tabDict.toString[index];
        if (view === 'flip') return this.doFlip();
        this.props.changeImageViews({ main: view });
    };
    componentWillReceiveProps(nextProps) {
        this.setActiveIndex(nextProps);
    }
    componentWillMount() {
        this.setActiveIndex();
    }
    render() {
        const activeView = this.props.imageViews.main;
        const isOpen = (name) => activeView === name;
        return (
            <VerticalTabs
                value={this.state.activeIndex}
                onChange={this.handleChange}
            >
                <VerticalTab
                    label="Crop"
                    icon={<Crop />}
                />
                <Collapse isOpened={isOpen('crop')}>
                    <CropSelector
                        cropView={this.props.imageViews.crop}
                        changeImageViews={this.props.changeImageViews}
                    />
                </Collapse>
                <VerticalTab
                    label="Rotate"
                    icon={<Rotate90DegreesCcw />}
                />
                <Collapse isOpened={isOpen('rotate')}>
                    <RotateSlider
                        value={this.props.image.rotate}
                        changeImage={this.props.changeImage}
                        changeImageTemp={this.props.changeImageTemp}
                    />
                </Collapse>
                <VerticalTab
                    label="Resize"
                    icon={<PhotoSizeSelectLarge />}
                />
                <VerticalTab
                    label="Flip"
                    icon={<Flip />}
                />
            </VerticalTabs>
        );
    }
}

export default connector(ImageEditor);
