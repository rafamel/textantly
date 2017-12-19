import React from 'react';
/* eslint-disable */
class Displayer extends React.Component {
    // static propTypes = {

    // };
    imageHasLoaded = () => {
        console.log('LOADED');
    };
    imageHasFailed = () => {
        console.log('Failed!');
        this.props.revertImage();
    };
    render() {
        return (
            <div id="displayer">
                <div className="container">
                    <div id="img-container">
                        <img
                            src={this.props.src}
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
