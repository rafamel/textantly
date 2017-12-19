import React from 'react';
import propTypes from 'prop-types';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';

class Editor extends React.Component {
    static propTypes = {
        textEditor: propTypes.bool.isRequired,
        changeImage: propTypes.func.isRequired,
        imageName: propTypes.string
    };
    render() {
        return (this.props.textEditor)
            ? (<TextEditor
                changeImage={this.props.changeImage}
                imageName={this.props.imageName} />)
            : (<ImageEditor />);
    }
}

export default Editor;
