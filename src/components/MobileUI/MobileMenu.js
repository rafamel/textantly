import React from 'react';
import { withState, compose } from 'store/utils';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import FolderOpen from 'material-ui-icons/FolderOpen';
import TextFormat from 'material-ui-icons/TextFormat';
import Image from 'material-ui-icons/Image';
import Undo from 'material-ui-icons/Undo';
import ImageOpener from '../Editor/ImageSelector/ImageOpener';

const styles = {
    root: {
        height: 72
    },
    tab: {
        flexGrow: 1,
        maxWidth: 'none',
        height: 72,
        paddingTop: 4
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        mainView: state.views.main,
        canBackwards: state.edits._history.can.backwards
    }), (actions) => ({
        setMainView: actions.views.setMain,
        backwards: actions.edits.backwards
    })
);

class MobileMenu extends React.Component {
    static propTypes = {
        ...storeTypes
    };
    state = {
        value: false
    };
    _isMounted = false;
    lock = false;
    tabDict = {
        toIndex: { open: 0, text: 1, image: 2, undo: 3 },
        toString: { 0: 'open', 1: 'text', 2: 'image', 3: 'undo' }
    };
    syncTab = (mainView = this.props.mainView) => {
        if (this.lock) return;
        this.setState({ value: this.tabDict.toIndex[mainView] });
    };
    handleChange = (event, value) => {
        const bounce = (cb) => {
            this.lock = true;
            setTimeout(() => {
                if (!this._isMounted) return;
                this.lock = false;
                this.syncTab();
                if (cb) cb();
            }, 300);
        };

        const { setMainView, backwards } = this.props;
        this.setState({ value });
        const view = this.tabDict.toString[value];
        // eslint-disable-next-line
        switch (view) {
        case 'open':
            return bounce(this.openFile);
        case 'text':
            return setMainView('text');
        case 'image':
            return setMainView('image');
        case 'undo':
            bounce();
            return backwards();
        default:
            return bounce();
        }
    };
    hookOpener = ({ openFile }) => {
        this.openFile = openFile;
    };
    componentWillReceiveProps(nextProps) {
        this.syncTab(nextProps.mainView);
    }
    componentWillMount() {
        this._isMounted = true;
        this.syncTab();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const { classes, canBackwards } = this.props;
        const value = this.state.value;
        const view = this.tabDict.toString[value];

        return (
            <Paper classes={{ root: classes.root }}>
                <ImageOpener actions={this.hookOpener}/>
                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    indicatorColor="none"
                    textColor="primary"
                    fullWidth
                >
                    <Tab
                        icon={<FolderOpen />}
                        label="Open"
                        classes={{ root: classes.tab }}
                    />
                    <Tab
                        icon={<TextFormat />}
                        label="Text"
                        classes={{ root: classes.tab }}
                    />
                    <Tab
                        icon={<Image />}
                        label="Edit"
                        classes={{ root: classes.tab }}
                    />
                    <Tab
                        icon={<Undo />}
                        label="Undo"
                        classes={{ root: classes.tab }}
                        disabled={!canBackwards && view !== 'undo'}
                    />
                </Tabs>
            </Paper>
        );
    }
}
export default compose(
    withStyles(styles),
    connector
)(MobileMenu);
