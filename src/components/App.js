import React from 'react';
import { MuiThemeProvider } from 'material-ui/styles';
import { Provider } from 'react-redux';
import store from 'store/_store';
import { withState, compose } from 'store/utils';
import Reboot from 'material-ui/Reboot';
import Header from './Header';
import Editor from './Editor/Editor';
import Displayer from './Displayer/Displayer';
import LoadingBar from './LoadingBar';
import SnackBar from './SnackBar';
import Navigation from './Navigation';
import HistoryButtons from './HistoryButtons';
import { classes as appClasses } from 'styles';
import theme from '../theme';

const { connector, propTypes: storeTypes } = withState(
    null,
    (actions) => ({
        startLoading: actions._loading.start,
        stopLoading: actions._loading.stop
    })
);

class App extends React.Component {
    static propTypes = {
        ...storeTypes
    };
    state = {
        hasLoaded: false
    };
    componentDidMount() {
        this.props.startLoading();
        const startAt = Date.now();
        const interval = setInterval(() => {
            if (document.readyState === 'complete' || (Date.now() - startAt) > 7500) {
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
            <div>
                <LoadingBar />
                <div style={hideUntilLoaded} >
                    <HistoryButtons />
                    <div className={appClasses.container}>
                        <Header />
                        <Navigation />
                        <Editor />
                        <Displayer />
                        <SnackBar />
                    </div>
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
