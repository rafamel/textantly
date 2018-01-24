import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'store/utils';
import UrlDialog from './UrlDialog';

const { connector, propTypes: storeTypes } = withState(
    null,
    (actions) => ({
        setSource: actions.edits.source.setSource,
        setLoading: actions._loading.setLoading,
        addAlert: actions.alerts.add
    })
);

class ImageOpener extends React.Component {
    static propTypes = {
        ...storeTypes,
        actions: PropTypes.func
    };
    state = {
        _urlDialogIsOpen: false
    };
    openUrl = () => {
        this.setState({ _urlDialogIsOpen: true });
    };
    readUrl = (url) => {
        this.setState({ _urlDialogIsOpen: false });
        if (!url) { return; }

        const imageName = (str) => str.split('/').slice(-1)[0];
        this.props.setSource({
            name: imageName(url),
            src: url,
            from: 'url'
        });
    };
    openFile = () => {
        this.setState({ _urlDialogIsOpen: false });
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
                this.readFile(name, fileReader.result);
            });
            fileReader.readAsDataURL(file);
        };
        input.click();
    };
    readFile = (name, src) => {
        this.props.setLoading(false);
        this.props.setSource({
            name,
            src,
            from: 'file'
        });
    };
    componentWillMount() {
        if (this.props.actions) {
            this.props.actions({
                openUrl: this.openUrl,
                openFile: this.openFile
            });
        }
    }
    render() {
        return (
            <UrlDialog
                _isOpen={this.state._urlDialogIsOpen}
                callback={this.readUrl}
            />
        );
    }
}

export default connector(ImageOpener);
