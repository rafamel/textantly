import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from 'material-ui/styles';
import { Provider, connect } from 'react-redux';
import store, { actions } from 'store';
import { compose } from 'redux';
import Reboot from 'material-ui/Reboot';
import Header from './Header';
import Editor from './Editor/Editor';
import Displayer from './Displayer/Displayer';
import LoadingBar from './LoadingBar';
import SnackBar from './SnackBar';
import { classes as appClasses } from 'styles';
import theme from '../theme';

const connector = connect(
    null,
    {
        startLoading: actions._loading.start,
        stopLoading: actions._loading.stop
    }
);
class App extends React.Component {
    static propTypes = {
        // Actions
        startLoading: PropTypes.func.isRequired,
        stopLoading: PropTypes.func.isRequired
    };
    state = {
        hasLoaded: false
    };
    componentDidMount() {
        this.props.startLoading();
        let count = -50;
        const interval = setInterval(() => {
            count += 50;
            if (document.readyState === 'complete' || count > 5000) {
                this.setState({ hasLoaded: true });
                this.props.stopLoading();
                clearInterval(interval);
            }
        }, 50);
    }
    render() {
        const hideUntilLoaded = (!this.state.hasLoaded)
            ? { opacity: 0 } : {};
        return (
            <div className={appClasses.container}>
                <LoadingBar />
                <div style={hideUntilLoaded} >
                    <Header />
                    <Editor />
                    <Displayer />
                    <SnackBar />
                </div>
            </div>
        );
    };
}

const wrapApp = (App) => function AppWrapper() {
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <Reboot />
                <App />
            </MuiThemeProvider>
        </Provider>
    );
};

export default compose(wrapApp, connector)(App);
