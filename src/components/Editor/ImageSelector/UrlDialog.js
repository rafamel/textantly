import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Dialog, {
    DialogActions,
    DialogContent,
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
    inputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    onSubmit = (e) => {
        e.preventDefault();
        this.openUrlImage();
    };
    render() {
        return (
            <Dialog
                open={this.props._isOpen}
                onClose={() => this.props.callback()}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle style={{ paddingBottom: 6 }} disableTypography>
                    <Typography type="button" style={{ opacity: 0.8 }}>
                        Open URL
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.onSubmit}>
                        <TextField
                            value={this.state.url}
                            onChange={this.inputChange}
                            name='url'
                            margin="dense"
                            label="http://"
                            type="text"
                            fullWidth
                            // eslint-disable-next-line
                            autoFocus
                        />
                    </form>
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
