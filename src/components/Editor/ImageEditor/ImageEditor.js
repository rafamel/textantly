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
import CropEditor from './CropEditor';
import RotateEditor from './RotateEditor';

const connector = connect(
    (state) => ({
        imageView: state._activeViews.image,
        cropView: state._activeViews.crop,
        image: state.edits.image
    }), {
        changeImageView: actions._activeViews.changeImage,
        changeCropView: actions._activeViews.changeCrop,
        changeImage: actions.edits.changeImage,
        changeImageTemp: actions.edits.changeImageTemp
    }
);

class ImageEditor extends React.Component {
    static propTypes = {
        // State
        imageView: PropTypes.string,
        cropView: PropTypes.string,
        image: PropTypes.object,
        // Actions
        changeImageView: PropTypes.func.isRequired,
        changeCropView: PropTypes.func.isRequired,
        changeImage: PropTypes.func.isRequired,
        changeImageTemp: PropTypes.func.isRequired
    };
    state = {
        activeIndex: 0
    };
    tabDict = {
        toIndex: { crop: 0, rotate: 1, resize: 2, flip: 3, null: false },
        toString: { 0: 'crop', 1: 'rotate', 2: 'resize', 3: 'flip', false: null }
    };
    setActiveIndex = (props = this.props) => {
        const imageIndex = this.tabDict.toIndex[props.imageView];
        if (imageIndex === this.state.activeIndex) return;
        this.setState({ activeIndex: imageIndex });
    };
    doFlip = () => {
        this.setState({ activeIndex: this.tabDict.toIndex.flip });
        setTimeout(this.setActiveIndex, 400);

        this.props.changeImage({
            flip: !this.props.image.flip
        });
    };
    handleChange = (e, index) => {
        const view = this.tabDict.toString[index];
        if (view === 'flip') return this.doFlip();
        this.props.changeImageView(view);
    };
    componentWillReceiveProps(nextProps) {
        this.setActiveIndex(nextProps);
    }
    componentWillMount() {
        this.setActiveIndex();
    }
    render() {
        const activeView = this.props.imageView;
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
                    <CropEditor
                        cropView={this.props.cropView}
                        changeCropView={this.props.changeCropView}
                    />
                </Collapse>
                <VerticalTab
                    label="Rotate"
                    icon={<Rotate90DegreesCcw />}
                />
                <Collapse isOpened={isOpen('rotate')}>
                    <RotateEditor
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
