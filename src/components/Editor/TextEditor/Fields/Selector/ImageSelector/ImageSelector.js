import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ReactFileReader from 'react-file-reader';
import Tabs, { Tab } from 'material-ui/Tabs';
import FolderOpen from 'material-ui-icons/FolderOpen';
import Public from 'material-ui-icons/Public';
import UrlDialog from './UrlDialog';

const styles = (theme) => ({
    root: {
        width: '100%'
    },
    nomax: {
        maxWidth: 'none'
    },
    hide: {
        display: 'none'
    }
});

class ImageSelector extends React.Component {
    static propTypes = {
        // Actions
        changeSrc: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        value: 1,
        _urlDialogIsOpen: false,
        openTimeout: null
    };
    onChangeImage = (image) => {
        if (!image) return;

        const imageName = (str) => str.split('/').slice(-1)[0];
        let src, name;
        if (image.hasOwnProperty('base64')) {
            src = image.base64;
            name = imageName(image.fileList[0].name);
        } else {
            src = image;
            name = imageName(image);
        }
        this.props.changeSrc({ src, name });
    };
    handleChange = (event, value) => {
        this.setState({ value });
        if (this.state.openTimeout) {
            clearTimeout(this.state.openTimeout);
        }
        const openTimeout = setTimeout(() => {
            if (value === 0) {
                if (value === 0) this.setState({ _urlDialogIsOpen: false });
                document.getElementById('file-reader').click();
            } else if (value === 1) {
                this.setState({ _urlDialogIsOpen: true });
            }
        }, 350);

        this.setState({ openTimeout });
    };
    urlDialogCallback = (url) => {
        this.setState({
            _urlDialogIsOpen: false
        });
        if (url) {
            this.onChangeImage(url);
        }
    };
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <UrlDialog
                    _isOpen={this.state._urlDialogIsOpen}
                    callback={this.urlDialogCallback}
                />
                <ReactFileReader
                    fileTypes={['image/']}
                    base64={true}
                    multipleFiles={false}
                    handleFiles={this.onChangeImage}
                >
                    <div
                        id='file-reader'
                        className={classes.hide}>
                    </div>
                </ReactFileReader>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    fullWidth
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab
                        icon={<FolderOpen />}
                        className={classes.nomax} />
                    <Tab
                        icon={<Public />}
                        className={classes.nomax} />
                </Tabs>
            </div>
        );
    }
}

export default withStyles(styles)(ImageSelector);
