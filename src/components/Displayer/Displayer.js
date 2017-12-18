import React from 'react';

class Displayer extends React.Component {
    // static propTypes = {
    //     Todo
    // };
    imageHasLoaded = () => {
        console.log('LOADED');
    };
    imageHasFailed = () => {
        console.log('Failed!');
        this.props.changeImage();
    };
    render() {
        return (
            <div id="displayer">
                <div className="container">
                    <div id="img-container">
                        <img
                            src={this.props.image}
                            onLoad={this.imageHasLoaded}
                            onError={this.imageHasFailed}
                            id="main-canvas"
                            alt="Main"
                        />
                        <div id="text-container" className="left horizontal-bars">
                            <div>
                                <div>
                                    <p>Your Text Here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Displayer;
