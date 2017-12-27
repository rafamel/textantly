import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from 'material-ui/Dialog';

class UrlDialog extends React.Component {
    static propTypes = {
        _isOpen: PropTypes.bool.isRequired,
        callback: PropTypes.func.isRequired
    };
    state = {
        url: ''
    };
    openUrlImage = () => {
        this.props.callback(this.state.url.trim());
    };
    inputChange = (ev) => {
        this.setState({
            [ev.target.name]: ev.target.value
        });
    };
    render() {
        return (
            <Dialog
                open={this.props._isOpen}
                onClose={() => this.props.callback()}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                {/* <DialogTitle id="form-dialog-title">
                    Open an Image from the Interwebs!
                </DialogTitle> */}
                <DialogContent>
                    <DialogContentText
                        style={{
                            fontWeight: '500',
                            marginBottom: '10px'
                        }}
                    >
                        Open an Image from the Interwebs!
                    </DialogContentText>
                    <TextField
                        value={this.state.url}
                        onChange={this.inputChange}
                        name='url'
                        // eslint-disable-next-line
                        autoFocus
                        margin="dense"
                        label="Image URL"
                        type="text"
                        placeholder="http://"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => this.props.callback()}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.openUrlImage}
                        color="primary"
                    >
                        Open
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default UrlDialog;
