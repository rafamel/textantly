import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import { Provider } from 'react-redux';
import store from 'store/_store';
import { withState, compose } from 'store/utils';
import Reboot from 'material-ui/Reboot';
import DesktopUI from './DesktopUI/DesktopUI';
import MobileUI from './MobileUI/MobileUI';
import LoadingBar from './TopBar/LoadingBar';
import SnackBar from './SnackBar';
import theme from '../theme';
import config from 'config';

const styles = {
    ui: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        '& > *': {
            flexGrow: 1
        }
    }
};

const { connector, propTypes: storeTypes } = withState(
    (state) => ({
        isMobile: state.views.isMobile
    }),
    (actions) => ({
        setLoading: actions._loading.setLoading,
        setMobile: actions.views.setMobile,
        loadSource: actions.edits.source.loadSource
    })
);

class App extends React.Component {
    static propTypes = {
        ...storeTypes,
        // JSS
        classes: PropTypes.object.isRequired
    };
    state = {
        hasLoaded: false
    };
    setUI = (width = window.innerWidth) => {
        const breakpoint = theme.breakpoints.values[config.mobileBreakpoint];
        const isMobile = width < breakpoint;

        if (isMobile !== this.props.isMobile) {
            this.setState({ hasLoaded: false });
            this.props.setLoading(true);
            this.props.setMobile(isMobile);
            setTimeout(() => {
                this.props.setLoading(false);
                this.setState({ hasLoaded: true });
            }, 500);
        }
    };
    componentWillMount() {
        this.props.loadSource();
        this.props.setLoading(true);
    }
    componentDidMount() {
        const startAt = Date.now();
        const interval = setInterval(() => {
            if (document.readyState === 'complete' || (Date.now() - startAt) > 7500) {
                this.setState({ hasLoaded: true });
                this.props.setLoading(false);
                clearInterval(interval);
            }
        }, 50);

        this.setUI();
        window.addEventListener('resize', (e) => {
            this.setUI(e.target.innerWidth);
        });
    }
    render() {
        const { isMobile, classes } = this.props;
        const hasLoaded = this.state.hasLoaded;
        return (
            <div>
                {!hasLoaded && (<LoadingBar />)}
                <div
                    className={classes.ui}
                    style={{ opacity: (hasLoaded) ? 1 : 0 }}
                >
                    {(isMobile) ? (<MobileUI />) : (<DesktopUI />)}
                </div>
                <SnackBar />
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

export default compose(
    wrapApp,
    withStyles(styles),
    connector
)(App);
