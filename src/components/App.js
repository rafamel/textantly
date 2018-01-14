import React from 'react';
import { MuiThemeProvider } from 'material-ui/styles';
import { Provider } from 'react-redux';
import store from 'store/_store';
import { withState, compose } from 'store/utils';
import Reboot from 'material-ui/Reboot';
import Header from './Header';
import LoadingBar from './LoadingBar';
import SnackBar from './SnackBar';
import DesktopUI from './DesktopUI/DesktopUI';
import { classes as appClasses } from 'styles';
import theme from '../theme';

const { connector, propTypes: storeTypes } = withState(
    null,
    (actions) => ({
        setLoading: actions._loading.setLoading
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
        this.props.setLoading(true);
        const startAt = Date.now();
        const interval = setInterval(() => {
            if (document.readyState === 'complete' || (Date.now() - startAt) > 7500) {
                this.setState({ hasLoaded: true });
                this.props.setLoading(false);
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
                <div style={{
                    ...hideUntilLoaded,
                    height: '100vh',
                    width: '100%'
                }}>
                    <DesktopUI />
                    {/* <div className={appClasses.container}>
                        <Header />
                        <Navigation />
                        <Editor />

                        <SnackBar />
                    </div> */}
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
