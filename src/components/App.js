import React from 'react';
import './App.css';
import Header from './Header';
import Editor from './Editor/Editor';
import Displayer from './Displayer/Displayer';

class App extends React.Component {
    defaultImage = 'static/default.png';
    state = {
        hasLoaded: false,
        textEditor: true,
        image: {
            src: this.defaultImage,
            name: '',
            last: {}
        }
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
    changeImage = ({ src, name }) => {
        const last = {
            name: this.state.image.name,
            src: this.state.image.src
        };
        this.setState({ image: { src, name, last } });
    };
    revertImage = () => {
        this.setState({
            image: {
                src: this.state.image.last.src,
                name: this.state.image.last.name,
                last: this.state.image.last
            }
        });
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
                    <div className="row">
                        <div className="col-md-12">
                            <Editor
                                textEditor={this.state.textEditor}
                                changeImage={this.changeImage}
                                imageName={this.state.image.name} />
                        </div>
                    </div>
                    <Displayer
                        src={this.state.image.src}
                        revertImage={this.revertImage} />
                </div>
            </div>
        );
    }
}

export default App;
