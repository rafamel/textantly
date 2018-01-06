import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'store';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import ResponsiveSwipeable from './ResponsiveSwipeable';
import EditText from 'material-ui-icons/TextFormat';
import EditImage from 'material-ui-icons/Image';
import TextEditor from './TextEditor/TextEditor';

const styles = (theme) => ({
    root: {
        maxWidth: '1100px',
        margin: '0 auto 32px'
    },
    appBar: {
        marginBottom: 25
    },
    nomax: {
        maxWidth: 'none'
    },
    editor: {
        padding: '14px 22px 18px'
    }
});

const connector = connect(
    (state) => ({
        activeEditor: state._activeEditor,
        historyCan: {
            backwards: state.edits._history.can.backwards,
            forwards: state.edits._history.can.forwards
        }
    }), {
        changeEditor: actions._activeEditor.change,
        reset: actions.edits.reset,
        backwards: actions.edits.backwards,
        forwards: actions.edits.forwards
    }
);

class Editor extends React.Component {
    static propTypes = {
        // State
        activeEditor: PropTypes.string.isRequired,
        historyCan: PropTypes.object.isRequired,
        // Actions
        changeEditor: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        backwards: PropTypes.func.isRequired,
        forwards: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired
    };
    tabDict = {
        toIndex: { text: 0, image: 1 },
        toString: { 0: 'text', 1: 'image' }
    };
    handleChange = (index) => {
        const editor = this.tabDict.toString[index];
        this.props.changeEditor(editor);
    };
    handleChangeEvent = (event, value) => {
        this.handleChange(value);
    };
    render() {
        const { classes, activeEditor } = this.props;
        const activeIndex = this.tabDict.toIndex[activeEditor];
        return (
            <div className={classes.root}>
                <button
                    onClick={this.props.backwards}
                    disabled={!this.props.historyCan.backwards}
                >
                    BACKWARDS
                </button>
                <button onClick={this.props.reset}>
                    RESET
                </button>
                <button
                    onClick={this.props.forwards}
                    disabled={!this.props.historyCan.forwards}
                >
                    FORWARDS
                </button>
                <AppBar
                    className={classes.appBar}
                    position="static"
                    color="inherit"
                >
                    <Tabs
                        value={activeIndex}
                        onChange={this.handleChangeEvent}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                        <Tab
                            className={classes.nomax}
                            label="Text"
                            icon={<EditText />}
                        />
                        <Tab
                            className={classes.nomax}
                            label="Edit Image"
                            icon={<EditImage />}
                        />
                    </Tabs>
                </AppBar>
                <Paper>
                    <ResponsiveSwipeable
                        index={activeIndex}
                        onChangeIndex={this.handleChange}
                    >
                        <TextEditor className={classes.editor} />
                        <TextEditor className={classes.editor} />
                    </ResponsiveSwipeable>
                </Paper>
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    connector
)(Editor);
