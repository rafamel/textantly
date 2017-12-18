import React from 'react';
import './App.css';
import Header from './Header';
import Editor from './Editor/Editor';
import Displayer from './Displayer/Displayer';

class App extends React.Component {
    defaultImage = 'static/default.png';
    state = {
        hasLoaded: false,
        image: this.defaultImage,
        textEditor: true
    };
    toggle = (property) => () => {
        const obj = {};
        obj[property] = !this.state[property];
        this.setState(obj);
    }
    changeImage = (image) => {
        if (!image) {
            return this.setState({ image: this.defaultImage });
        }
        if (image.hasOwnProperty('target')) {
            return this.setState({ image: image.target.value });
        }
        return this.setState({ image: image.base64 });
    };
    componentDidMount() {
        let count = -50;
        const interval = setInterval(() => {
            count += 50;
            if (document.readyState === 'complete' || count > 5000) {
                this.toggle('hasLoaded')();
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
                <div className="container main">
                    <Header
                        textEditor={this.state.textEditor}
                        toggle={this.toggle} />
                    <div className="row">
                        <div className="col-md-12">
                            <Editor
                                textEditor={this.state.textEditor}
                                changeImage={this.changeImage} />
                        </div>
                    </div>
                    <Displayer
                        image={this.state.image}
                        changeImage={this.changeImage} />
                </div>
            </div>
        );
    }
}

export default App;
