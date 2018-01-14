import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';
import FolderOpen from 'material-ui-icons/FolderOpen';
import Public from 'material-ui-icons/Public';
import UrlDialog from './UrlDialog';
import FreeLabel from 'components/Elements/Fields/FreeLabel';

const styles = (theme) => ({
    root: {
        width: '100%'
    },
    tab: {
        maxWidth: 'none',
        height: 46
    },
    hide: {
        display: 'none'
    }
});

class ImageSelector extends React.Component {
    static propTypes = {
        // Style
        className: PropTypes.string,
        style: PropTypes.object,
        // State & Actions
        sourceFrom: PropTypes
            .oneOfType([PropTypes.string, PropTypes.bool])
            .isRequired,
        setLoading: PropTypes.func.isRequired,
        setRendering: PropTypes.func.isRequired,
        setSourceTemp: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        tab: { current: false, lock: false },
        _urlDialogIsOpen: false
    };
    openTimeout = null;
    tabDict = {
        toIndex: { file: 0, url: 1 },
        toString: { 0: 'file', 1: 'url' }
    };
    unlockSyncTab = (props = this.props) => {
        this.setState({
            tab: { current: props.sourceFrom, lock: false }
        });
    };
    setImage = (obj) => {
        // this.props.setRendering(true);
        this.props.setSourceTemp(obj);
    };
    handleTabChange = (event, value) => {
        const tab = this.tabDict.toString[value];
        this.setState({ tab: { current: tab, lock: true } });

        if (this.openTimeout) {
            clearTimeout(this.openTimeout);
        }

        const openTimeout = setTimeout(() => {
            if (tab === 'file') {
                this.setState({ _urlDialogIsOpen: false });
                this.readFile();
            } else if (tab === 'url') {
                this.setState({ _urlDialogIsOpen: true });
            }
            this.openTimeout = null;
        }, 350);

        this.openTimeout = openTimeout;
    };
    readUrl = (url) => {
        this.setState({ _urlDialogIsOpen: false });
        if (!url) {
            this.unlockSyncTab();
            return;
        }

        const imageName = (str) => str.split('/').slice(-1)[0];
        this.setState({ tab: { current: 'url', lock: false } });
        this.setImage({
            name: imageName(url),
            src: url,
            from: 'url'
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
                this.props.addAlert(`File ${name} is not an image`);
                return;
            }

            const fileReader = new FileReader();
            this.props.setLoading(true);
            fileReader.addEventListener('load', () => {
                this.props.setLoading(false);
                this.setState({ tab: { current: 'file', lock: false } });
                this.setImage({
                    name,
                    src: fileReader.result,
                    from: 'file'
                });
            });
            fileReader.readAsDataURL(file);
        };
        input.click();
        this.unlockSyncTab();
    };
    componentWillReceiveProps(nextProps) {
        const tab = this.state.tab;
        if (!tab.lock && tab.current !== nextProps.sourceFrom) {
            this.unlockSyncTab(nextProps);
        }
    }
    componentWillMount() {
        this.unlockSyncTab();
    }
    render() {
        const { classes, className, style } = this.props;
        let tabIndex = this.tabDict.toIndex[this.state.tab.current];
        if (tabIndex == null) tabIndex = false;
        return (
            <div
                className={classnames(classes.root, className)}
                style={{
                    marginBottom: 4,
                    ...style
                }}
            >
                <UrlDialog
                    _isOpen={this.state._urlDialogIsOpen}
                    callback={this.readUrl}
                />
                <FreeLabel
                    label="Select image"
                    style={{ marginBottom: -2 }}
                />
                <Tabs
                    value={tabIndex}
                    onChange={this.handleTabChange}
                    fullWidth
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab
                        icon={<FolderOpen />}
                        className={classes.tab}
                    />
                    <Tab
                        icon={<Public />}
                        className={classes.tab}
                    />
                </Tabs>
            </div>
        );
    }
}

export default withStyles(styles)(ImageSelector);
