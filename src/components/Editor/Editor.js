import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'store';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import EditText from 'material-ui-icons/TextFormat';
import EditImage from 'material-ui-icons/Image';
import TextEditor from './TextEditor/TextEditor';

const styles = (theme) => ({
    paper: {
        maxWidth: '1100px',
        margin: '0 auto'
    },
    nomax: {
        maxWidth: 'none'
    }
});

const connector = connect(
    (state) => ({
        activeIndex: (state._activeEditor === 'text') ? 0 : 1
    }), {
        changeEditor: actions._activeEditor.change
    }
);

class Navigation extends React.Component {
    static propTypes = {
        // State
        activeIndex: PropTypes.number.isRequired,
        // Actions
        changeEditor: PropTypes.func.isRequired,
        // JSS
        classes: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired
    };
    handleChange = (index) => {
        this.props.changeEditor({
            to: (index === 0) ? 'text' : 'image'
        });
    };
    handleChangeEvent = (event, value) => {
        this.handleChange(value);
    };
    render() {
        const { classes, theme } = this.props;
        return (
            <Paper className={classes.paper}>
                <AppBar position="static" color="inherit">
                    <Tabs
                        value={this.props.activeIndex}
                        onChange={this.handleChangeEvent}
                        fullWidth
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab
                            className={classes.nomax}
                            label="Text"
                            icon={<EditText />} />
                        <Tab
                            className={classes.nomax}
                            label="Edit Image"
                            icon={<EditImage />} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.props.activeIndex}
                    onChangeIndex={this.handleChange}
                >
                    <TextEditor />
                    <TextEditor />
                </SwipeableViews>
            </Paper>
        );
    }
}

export default compose(
    withStyles(styles, { withTheme: true }),
    connector
)(Navigation);
