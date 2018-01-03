import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
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
        // Props (Actions)
        changeSrc: PropTypes.func.isRequired,
        loadingStart: PropTypes.func.isRequired,
        loadingStop: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        value: 1,
        _urlDialogIsOpen: false,
        openTimeout: null
    };
    handleChange = (event, value) => {
        this.setState({ value });
        if (this.state.openTimeout) {
            clearTimeout(this.state.openTimeout);
        }
        const openTimeout = setTimeout(() => {
            if (value === 0) {
                this.setState({ _urlDialogIsOpen: false });
                this.readFile();
            } else if (value === 1) {
                this.setState({ _urlDialogIsOpen: true });
            }
        }, 350);

        this.setState({ openTimeout });
    };
    readUrl = (url) => {
        this.setState({ _urlDialogIsOpen: false });
        if (!url) return;

        const imageName = (str) => str.split('/').slice(-1)[0];
        this.props.changeSrc({
            name: imageName(url),
            src: url
        });
    };
    readFile = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.onchange = () => {
            const file = input.files[0];
            if (!file) return;

            const { name, type } = file;
            if (!type.match(/^image\//)) {
                this.props.addAlert(`The file ${name} is not an image`);
                return;
            }

            this.props.loadingStart();
            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                this.props.loadingStop();
                this.props.changeSrc({
                    name,
                    src: fileReader.result
                });
            });
            fileReader.readAsDataURL(file);
        };
        input.click();
    };
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <UrlDialog
                    _isOpen={this.state._urlDialogIsOpen}
                    callback={this.readUrl}
                />
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
