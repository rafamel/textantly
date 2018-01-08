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

function dict(x, type, obj) {
    // eslint-disable-next-line
    if (typeof x !== type) return false;
    const ans = obj[x];
    return (ans === undefined) ? false : ans;
}

class ImageSelector extends React.Component {
    constructor(props) {
        super(props);

        this.openTimeout = null;
        this.tabDict = {
            toIndex: (x) => dict(x, 'string', {
                file: 0, url: 1
            }),
            toString: (x) => dict(x, 'number', {
                0: 'file', 1: 'url'
            })
        };
    }
    static propTypes = {
        // Props
        className: PropTypes.string,
        style: PropTypes.object,
        // Props (Store)
        srcFrom: PropTypes
            .oneOfType([PropTypes.string, PropTypes.bool])
            .isRequired,
        // Props (Actions)
        changeSrcTemp: PropTypes.func.isRequired,
        tempForget: PropTypes.func.isRequired,
        loadingStart: PropTypes.func.isRequired,
        loadingStop: PropTypes.func.isRequired,
        addAlert: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        _urlDialogIsOpen: false
    };
    handleTabChange = (event, value) => {
        const tab = this.tabDict.toString(value);
        this.props.changeSrcTemp({ from: tab });

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
            this.props.tempForget();
            return;
        }

        const imageName = (str) => str.split('/').slice(-1)[0];
        this.props.changeSrcTemp({
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

            this.props.loadingStart();
            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                this.props.loadingStop();
                this.props.changeSrcTemp({
                    name,
                    src: fileReader.result,
                    from: 'file'
                });
            });
            fileReader.readAsDataURL(file);
        };
        input.click();
        this.props.tempForget();
    };
    render() {
        const { classes, className, style, srcFrom } = this.props;
        const tabIndex = this.tabDict.toIndex(srcFrom);
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
