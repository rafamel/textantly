import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { Provider, connect } from 'react-redux';
import store, { actions } from 'store';
import { compose } from 'redux';
import Header from './Header';
import Editor from './Editor/Editor';
import Displayer from './Displayer/Displayer';
import LoadingBar from './LoadingBar';

// CSS
import './App.css';
// Colors
import teal from 'material-ui/colors/teal';
import blueGrey from 'material-ui/colors/blueGrey';

const theme = createMuiTheme({
    palette: {
        primary: teal,
        secondary: blueGrey
    },
    typography: {
    // Use the system font.
        fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Roboto,Helvetica,Arial,sans-serif',
        htmlFontSize: '19'
    }
});

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
            ? { display: 'none' }
            : {};
        return (
            <div className="App">
                <LoadingBar />
                <div style={hideUntilLoaded} >
                    <Header />
                    <Editor />
                    <Displayer />
                </div>
            </div>
        );
    };
}

const wrapApp = (App) => function AppWrapper() {
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </Provider>
    );
};

export default compose(wrapApp, connector)(App);
