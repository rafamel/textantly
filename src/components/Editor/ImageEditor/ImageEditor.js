import React from 'react';
import { withState } from 'store/utils';
import VerticalTabs, { VerticalTab } from 'components/Elements/VerticalTabs';
import { Collapse } from 'react-collapse';
import Crop from 'material-ui-icons/Crop';
import Flip from 'material-ui-icons/Flip';
import Rotate90DegreesCcw from 'material-ui-icons/Rotate90DegreesCcw';
import PhotoSizeSelectLarge from 'material-ui-icons/PhotoSizeSelectLarge';
import CropSelector from './Fields/CropSelector';
import RotateSlider from './Fields/RotateSlider';
import ResizeSliders from './Fields/ResizeSliders';
import engine from 'engine';

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        imageEdits: state.edits.image,
        imageViews: state._activeViews.image,
        sourceDimensions: state.edits.source.dimensions
    }), (actions) => ({
        changeImageViews: actions._activeViews.changeImage,
        setImageHard: actions.edits.setImageHard,
        setImageTemp: actions.edits.setImageTemp
    })
);

class ImageEditor extends React.Component {
    static propTypes = {
        ...storeTypes
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

        this.props.setImageHard({
            flip: !this.props.imageEdits.flip
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
        const {
            imageViews,
            changeImageViews,
            imageEdits,
            setImageHard,
            setImageTemp,
            sourceDimensions
        } = this.props;
        const isOpen = (name) => imageViews.main === name;
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
                        cropView={imageViews.crop}
                        changeImageViews={changeImageViews}
                    />
                </Collapse>
                <VerticalTab
                    label="Rotate"
                    icon={<Rotate90DegreesCcw />}
                />
                <Collapse isOpened={isOpen('rotate')}>
                    <RotateSlider
                        value={imageEdits.rotate}
                        setImageHard={setImageHard}
                        setImageTemp={setImageTemp}
                    />
                </Collapse>
                <VerticalTab
                    label="Resize"
                    icon={<PhotoSizeSelectLarge />}
                />
                <Collapse isOpened={isOpen('resize')}>
                    <ResizeSliders
                        value={imageEdits.resize}
                        dimensions={engine.getDimensions(
                            sourceDimensions,
                            { ...imageEdits, resize: undefined }
                        )}
                        setImageHard={setImageHard}
                        setImageTemp={setImageTemp}
                    />
                </Collapse>
                <VerticalTab
                    label="Flip"
                    icon={<Flip />}
                />
            </VerticalTabs>
        );
    }
}

export default connector(ImageEditor);
