import React from 'react';
import propTypes from 'prop-types';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';

class Editor extends React.Component {
    static propTypes = {
        textEditor: propTypes.boolean,
        changeImage: propTypes.function
    };
    render() {
        return (this.props.textEditor)
            ? (<TextEditor
                changeImage={this.props.changeImage} />)
            : (<ImageEditor />);
    }
}

export default Editor;
