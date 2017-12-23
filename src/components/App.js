import React from 'react';
import './App.css';
import Header from './Header';
import Editor from './Editor/Editor';
import Displayer from './Displayer/Displayer';
import { Provider } from 'react-redux';
import { store } from './store';

class App extends React.Component {
    state = {
        hasLoaded: false,
        textEditor: true
    };
    componentDidMount() {
        let count = -50;
        const interval = setInterval(() => {
            count += 50;
            if (document.readyState === 'complete' || count > 5000) {
                this.toggleOnApp('hasLoaded')();
                clearInterval(interval);
            }
        }, 50);
    }
    toggleOnApp = (property) => () => {
        const obj = {};
        obj[property] = !this.state[property];
        this.setState(obj);
    };
    render() {
        return (
            <div
                className="App"
                style={
                    (!this.state.hasLoaded) ? { display: 'none' } : {}
                }
            >
                <div className="container main">
                    <Header
                        textEditor={this.state.textEditor}
                        toggleOnApp={this.toggleOnApp} />
                    <div className="ro  ">
                        <div className="col-md-12">
                            <Editor
                                textEditor={this.state.textEditor} />
                        </div>
                    </div>
                    <Displayer />
                </div>
            </div>
        );
    }
}

export default () => (
    <Provider store={store}>
        <App />
    </Provider>
);
