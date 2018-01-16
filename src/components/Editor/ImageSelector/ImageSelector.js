import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';
import FolderOpen from 'material-ui-icons/FolderOpen';
import Public from 'material-ui-icons/Public';
import UrlDialog from './UrlDialog';

const styles = (theme) => ({
    root: {
        width: '100%'
    },
    tab: {
        maxWidth: 'none'
    },
    hide: {
        display: 'none'
    }
});

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        sourceFrom: state.edits.source.from
    }), (actions) => ({
        setSourceTemp: actions.edits.setSourceTemp,
        setLoading: actions._loading.setLoading,
        setRendering: actions._loading.setRendering,
        addAlert: actions.alerts.add
    })
);

class ImageSelector extends React.Component {
    static propTypes = {
        ...storeTypes,
        // Style
        className: PropTypes.string,
        style: PropTypes.object,
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
                const displayName = (name.length <= 30)
                    ? name
                    : name.slice(0, 30) + '...';
                this.props.addAlert(`File ${displayName} is not an image`);
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
                style={style}
            >
                <UrlDialog
                    _isOpen={this.state._urlDialogIsOpen}
                    callback={this.readUrl}
                />
                <Tabs
                    value={tabIndex}
                    onChange={this.handleTabChange}
                    fullWidth
                    indicatorColor="none"
                    textColor="primary"
                >
                    <Tab
                        icon={<FolderOpen />}
                        label="File"
                        classes={{ root: classes.tab }}
                    />
                    <Tab
                        icon={<Public />}
                        label="URL"
                        classes={{ root: classes.tab }}
                    />
                </Tabs>
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(ImageSelector);
