import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import SaveIcon from 'material-ui-icons/Save';
import TextView from './TextView/TextView';
import engine from 'engine';
import html2canvas from 'html2canvas';

const styles = {
    parent: {
        position: 'relative',
        overflow: 'hidden'
    },
    textView: {
        position: 'absolute',
        left: '150%',
        display: 'inline-block'
    },
    button: {
        boxShadow: 'none'
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        drawn: state.canvases.drawn.canvas,
        drawnId: state.canvases.drawn.id,
        name: state.edits.source.name
    }), (actions) => ({
        draw: actions.canvases.draw,
        setRendering: actions._loading.setRendering,
        addAlert: actions.alerts.add
    })
);

class Downloader extends React.Component {
    static propTypes = {
        ...storeTypes,
        className: PropTypes.string,
        // JSS
        classes: PropTypes.object
    };
    state = {
        renderTextView: false
    };
    _isMounted = false;
    _downloadPending = true;
    timeout = null;
    interval = null;
    textViewNode = null;
    onDownloadClick = () => {
        this._downloadPending = true;
        this.props.setRendering(true);

        const id = this.props.drawnId;
        this.props.draw({ forceIncrease: true });

        clearTimeout(this.timeout);
        clearInterval(this.interval);
        this.timeout = setTimeout(() => {
            clearInterval(this.interval);
            this.props.setRendering(false);
            this.props.addAlert(`There was an error while rendering the image. Please retry.`);
        }, 5000);
        this.interval = setInterval(() => {
            if (this.props.drawnId <= id) return;
            clearInterval(this.interval);
            clearTimeout(this.timeout);
            this.props.setRendering(true);
            if (this._isMounted) this.setState({ renderTextView: true });
        }, 100);
    };
    download = () => {
        if (!this._downloadPending || !this.textViewNode) return;
        this._downloadPending = false;

        const finalize = () => {
            this.textViewNode = null;
            if (this._isMounted) this.setState({ renderTextView: false });
            this.props.setRendering(false);
        };

        const options = { backgroundColor: null, scale: 2, logging: false };
        html2canvas(this.textViewNode, options)
            .then(canvas => {
                const forDownload = engine.merge(this.props.drawn, canvas)
                    .toDataURL('image/png');
                finalize();

                const link = document.createElement('a');
                link.href = forDownload;
                link.download = `textantly-${this.props.name || Date.now()}.png`;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
            })
            .catch(_ => {
                finalize();
                this.props.addAlert(`There was an error while rendering the text. Please retry.`);
            });
    };
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.renderTextView !== nextState.renderTextView;
    }
    render() {
        const { classes, className, drawn } = this.props;
        const textView = (!this.state.renderTextView)
            ? null
            : (
                <div
                    className={classes.textView}
                    ref={(ref) => { this.textViewNode = ref; }}
                >
                    <TextView
                        style={{ width: drawn.width, height: drawn.height }}
                        onLoad={this.download}
                        renderImage={false}
                    />
                </div>
            );
        return (
            <div className={className}>
                <div className={classes.parent}>
                    <Button
                        onClick={this.onDownloadClick}
                        classes={{ root: classes.button }}
                        aria-label="save"
                        raised
                        fab
                    >
                        <SaveIcon />
                    </Button>
                    { textView }
                </div>
            </div>
        );
    }
};

export default compose(
    withStyles(styles),
    connector
)(Downloader);
