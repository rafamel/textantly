import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { Provider } from 'react-redux';
import store from 'store';
import Header from './Header';
import Editor from './Editor/Editor';
import Displayer from './Displayer/Displayer';

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

class App extends React.Component {
    state = {
        hasLoaded: false
    };
    componentDidMount() {
        let count = -50;
        const interval = setInterval(() => {
            count += 50;
            if (document.readyState === 'complete' || count > 5000) {
                this.setState({ hasLoaded: true });
                clearInterval(interval);
            }
        }, 50);
    }
    render() {
        return (
            <div
                className="App"
                style={
                    (!this.state.hasLoaded) ? { display: 'none' } : {}
                }
            >
                <Header />
                <Editor />
                <Displayer />
            </div>
        );
    };
}

const AppWrapper = () => (
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </Provider>
);

export default AppWrapper;
