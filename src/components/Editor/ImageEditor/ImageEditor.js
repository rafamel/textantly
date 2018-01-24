import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withTheme } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import TopTabs from '../../MobileUI/TopTabs';
import VerticalTabs, { VerticalTab } from './VerticalTabs';
import { Collapse } from 'react-collapse';
import Crop from 'material-ui-icons/Crop';
import Flip from 'material-ui-icons/Flip';
import Rotate90DegreesCcw from 'material-ui-icons/Rotate90DegreesCcw';
import PhotoSizeSelectLarge from 'material-ui-icons/PhotoSizeSelectLarge';
import CropSelector from './Fields/CropSelector';
import RotateSlider from './Fields/RotateSlider';
import ResizeSliders from './Fields/ResizeSliders';
import { selectors } from 'store';

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        imageViews: state.views.image,
        isMobile: state.views.isMobile,
        flipVal: selectors.edits.image.flip(state)
    }), (actions) => ({
        setImageViews: actions.views.setImage,
        flip: actions.edits.image.flip
    })
);

class ImageEditor extends React.Component {
    static propTypes = {
        ...storeTypes,
        // JSS
        theme: PropTypes.object.isRequired
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

        this.props.flip(!this.props.flipVal);
        setTimeout(() => {
            this.lockIndex = false;
            this.setActiveIndex();
        }, 400);
    };
    handleChange = (e, index) => {
        const view = this.tabDict.toString[index];
        if (view === 'flip') return this.doFlip();

        this.props.setImageViews({ main: view });
    };
    componentWillReceiveProps(nextProps) {
        this.setActiveIndex(nextProps);
    }
    componentWillMount() {
        this.setActiveIndex();
    }
    render() {
        const {
            theme,
            imageViews,
            setImageViews,
            isMobile
        } = this.props;

        const fields = {
            crop: (<CropSelector
                key="crop"
                cropView={imageViews.crop}
                setImageViews={setImageViews}
            />),
            rotate: (<RotateSlider key="rotate" />),
            resize: (<ResizeSliders key="resize" />)
        };

        const isOpen = (name) => imageViews.main === name;
        return (isMobile)
            ? (
                <React.Fragment>
                    <TopTabs
                        value={this.state.activeIndex}
                        onChange={this.handleChange}
                        labels={['Crop', 'Rotate', 'Resize', 'Flip']}
                    />
                    <SwipeableViews
                        axis={(theme.direction === 'rtl') ? 'x-reverse' : 'x'}
                        index={this.tabDict.toIndex[imageViews.main]}
                        animateHeight={true}
                        disabled
                    >
                        {
                            Object.keys(fields).reduce((acc, key) => {
                                acc[this.tabDict.toIndex[key]] = fields[key];
                                return acc;
                            }, [])
                        }
                    </SwipeableViews>
                </React.Fragment>
            ) : (
                <VerticalTabs
                    value={this.state.activeIndex}
                    onChange={this.handleChange}
                >
                    <VerticalTab
                        label="Crop"
                        icon={<Crop />}
                    />
                    <Collapse isOpened={isOpen('crop')}>
                        {fields.crop}
                    </Collapse>
                    <VerticalTab
                        label="Rotate"
                        icon={<Rotate90DegreesCcw />}
                    />
                    <Collapse isOpened={isOpen('rotate')}>
                        {fields.rotate}
                    </Collapse>
                    <VerticalTab
                        label="Resize"
                        icon={<PhotoSizeSelectLarge />}
                    />
                    <Collapse isOpened={isOpen('resize')}>
                        {fields.resize}
                    </Collapse>
                    <VerticalTab
                        label="Flip"
                        icon={<Flip />}
                    />
                </VerticalTabs>
            );
    }
}

export default compose(
    withTheme(),
    connector
)(ImageEditor);
