import React from 'react';
import PropTypes from 'prop-types';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Grow from 'material-ui/transitions/Grow';
import Button from 'material-ui/Button';
import SaveIcon from 'material-ui-icons/Save';
import TextIcon from 'material-ui-icons/TextFormat';
import ImageIcon from 'material-ui-icons/Image';
import TextView from './TextView/TextView';
import engine from 'engine';
import html2canvas from 'html2canvas';
import isEqual from 'lodash.isequal';
import classnames from 'classnames';

const styles = {
    button: {
        boxShadow: 'none',
        '&:first-child': {
            marginBottom: 8
        }
    },
    saveButton: {
        position: 'absolute',
        left: 0,
        bottom: 0
    },
    buttonsContainer: {
        display: 'flex',
        position: 'relative',
        width: 56,
        height: 56,
        '&.bc-forOpen': {
            height: 120
        }
    },
    parent: {
        position: 'relative',
        overflow: 'hidden'
    },
    textView: {
        position: 'absolute',
        left: '150%',
        display: 'inline-block'
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        drawn: state.canvases.drawn.canvas,
        drawnId: state.canvases.drawn.id,
        name: state.edits.source.name
    }), (actions) => ({
        draw: actions.canvases.draw,
        setLoading: actions._loading.setLoading,
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
        renderTextView: false,
        open: false,
        forOpen: false
    };
    _isMounted = false;
    timeout = null;
    interval = null;
    textViewNode = null;
    buttonsToggle = () => {
        const open = this.state.open;
        const toSet = (!open)
            ? { open: true, forOpen: true }
            : { open: false };
        this.setState(toSet);
        if (open) {
            setTimeout(() => {
                if (this._isMounted) this.setState({ forOpen: false });
            }, 225);
        }
    };
    download = (withText = true) => () => {
        this.props.setLoading(true);

        const id = this.props.drawnId;
        this.props.draw({ forceIncrease: true });

        clearTimeout(this.timeout);
        clearInterval(this.interval);
        this.timeout = setTimeout(() => {
            clearInterval(this.interval);
            this.props.setLoading(false);
            this.props.addAlert(`There was an error while rendering the image. Please retry.`);
        }, 5000);
        this.interval = setInterval(() => {
            if (this.props.drawnId <= id) return;
            clearInterval(this.interval);
            clearTimeout(this.timeout);

            if (!withText) this.deliver(this.props.drawn);
            else if (this._isMounted) this.setState({ renderTextView: true });
        }, 100);
    };
    withText = () => {
        if (!this.textViewNode) return;

        const finalize = () => {
            this.textViewNode = null;
            if (this._isMounted) this.setState({ renderTextView: false });
        };

        const options = { backgroundColor: null, scale: 2, logging: false };
        html2canvas(this.textViewNode, options)
            .then(canvas => {
                const toDeliver = engine.merge(this.props.drawn, canvas);
                finalize();
                this.deliver(toDeliver);
            })
            .catch(_ => {
                finalize();
                this.props.setLoading(false);
                this.props.addAlert(`There was an error while rendering the text. Please retry.`);
            });
    };
    deliver = (canvas) => {
        let name = `textantly-${this.props.name || Date.now()}`;
        if (!name.match(/\.png$/)) name += '.png';

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = name;
        link.style.display = 'none';
        document.body.appendChild(link);

        this.props.setLoading(false);
        link.click();
    };
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.state, nextState);
    }
    render() {
        const { classes, className, drawn } = this.props;
        const { open, forOpen } = this.state;

        const textView = (!this.state.renderTextView)
            ? null
            : (
                <div
                    className={classes.textView}
                    ref={(ref) => { this.textViewNode = ref; }}
                >
                    <TextView
                        style={{ width: drawn.width, height: drawn.height }}
                        onReady={this.withText}
                        renderImage={false}
                    />
                </div>
            );
        return (
            <div className={className}>
                <div
                    className={classnames({
                        [classes.buttonsContainer]: true,
                        'bc-forOpen': forOpen
                    })}
                    onBlur={() => { if (open) this.buttonsToggle(); }}
                >
                    <Grow in={open} timeout={200}>
                        <div>
                            <Button
                                onClick={this.download(false)}
                                classes={{ root: classes.button }}
                                raised
                                fab
                            >
                                <ImageIcon />
                            </Button>
                            <Button
                                onClick={this.download()}
                                classes={{ root: classes.button }}
                                raised
                                fab
                            >
                                <TextIcon />
                            </Button>
                        </div>
                    </Grow>
                    <Grow in={!open}>
                        <Button
                            onClick={this.buttonsToggle}
                            style={{ zIndex: (forOpen) ? -1 : 0 }}
                            classes={{
                                root: classnames(
                                    classes.button, classes.saveButton
                                )
                            }}
                            aria-label="save"
                            raised
                            fab
                        >
                            <SaveIcon />
                        </Button>
                    </Grow>
                </div>
                <div className={classes.parent}>
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
