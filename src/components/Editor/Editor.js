import React from 'react';
import propTypes from 'prop-types';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';

class Editor extends React.Component {
    static propTypes = {
        textEditor: propTypes.bool.isRequired,
    };
    render() {
        return (this.props.textEditor)
            ? (<TextEditor />)
            : (<ImageEditor />);
    }
}

export default Editor;
