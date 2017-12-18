import React from 'react';
import propTypes from 'prop-types';
import ReactFileReader from 'react-file-reader';

class TextEditor extends React.Component {
    static propTypes = {
        changeImage: propTypes.function
    };
    state = {
        urlForm: false
    }
    changeForm = () => {
        this.setState({ urlForm: !this.state.urlForm });
    }
    render() {
        return (
            <div className="well bs-component" id="main-form">
                <div className="form-horizontal">
                    <fieldset>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="i-text" className="control-label">Text</label>
                                    <input type="text" className="form-control" id="i-text" placeholder="Your Text Here" defaultValue="Your Text Here"></input>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="i-font" className="control-label">Font family</label>
                                    <input type="text" className="form-control" id="i-font" defaultValue="Playfair Display SC" placeholder="Playfair Display SC"></input>
                                    <span className="help-block">Any <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">Google Font</a> is valid.</span>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="i-weight" className="control-label">Text Weight</label>
                                    <select className="form-control" id="i-weight">
                                        <option value="300">Light</option>
                                        <option value="400" selected>Normal</option>
                                        <option value="700">Bold</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="i-align" className="control-label">Text Alignment</label>
                                    <select className="form-control" id="i-align">
                                        <option value="left">Left</option>
                                        <option value="center" selected>Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>

                            </div>

                            <div className="col-md-6">
                                <FileUrlForm
                                    changeForm={this.changeForm}
                                    urlForm={this.state.urlForm}
                                    changeImage={this.props.changeImage} />

                                <div className="form-group">
                                    <label htmlFor="i-position" className="control-label">Overlay Position</label>
                                    <select className="form-control" id="i-position">
                                        <option value="left" selected>Left</option>
                                        <option value="right">Right</option>
                                        <option value="top">Top</option>
                                        <option value="bottom">Bottom</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="i-width" className="control-label">Overlay Width</label>
                                    <input type="text" className="form-control" id="i-width" defaultValue="40%" placeholder="40%"></input>
                                    <span className="help-block">Percentages, px, and rem units are valid.</span>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="i-scheme" className="control-label">Color Scheme</label>
                                    <select className="form-control" id="i-scheme">
                                        <option value="light" selected>Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="bs-component btn-group-sm btn-group-margin">
                                    <a className="btn btn-fab btn-primary edit-btn" data-toggle="tooltip" data-placement="right" title="" data-original-title="Crop & Resize"><i className="material-icons">edit</i></a>
                                    <a className="btn btn-fab btn-default" id="overlay-on-off" data-toggle="tooltip" data-placement="right" title="" data-original-title="Activate / Deactivate Text"><i className="material-icons">text_fields</i></a>
                                </div>
                            </div>
                            <div className="col-md-6 text-right">
                                <a className="btn btn-flat">Update</a>
                                <a className="btn btn-flat btn-raised btn-primary" id="download-btn">Download</a>
                            </div>
                        </div>

                    </fieldset>
                </div>
            </div>
        );
    }
}

class FileUrlForm extends React.Component {
    render() {
        return (this.props.urlForm)
            ? (<UrlForm
                changeForm={this.props.changeForm}
                changeImage={this.props.changeImage} />)
            : (<FileForm
                changeForm={this.props.changeForm}
                changeImage={this.props.changeImage} />);
    }
}

class UrlForm extends React.Component {
    render() {
        return (
            <div className="form-group" id="url-form">
                <label htmlFor="i-image-url" className="control-label">Image</label>
                <div className="sm-btn-input">
                    <input
                        onChange={this.props.changeImage}
                        type="text"
                        className="form-control"
                        id="i-image-url"
                        placeholder="http://..."
                    />
                    <a
                        onClick={this.props.changeForm}
                        className="btn btn-default btn-fab btn-fab-mini btn-url-file"
                        data-toggle="tooltip"
                        data-placement="left"
                        title=""
                        data-original-title="Get Image from File">
                        <i className="material-icons">folder_open</i>
                    </a>
                </div>
            </div>
        );
    }
}
class FileForm extends React.Component {
    render() {
        return (
            <div id="file-form">
                <label htmlFor="i-image-local" className="control-label">Image</label>
                <div className="sm-btn-input">
                    <div className="form-group">
                        <ReactFileReader
                            fileTypes={["image/"]} base64={true} multipleFiles={false}
                            handleFiles={this.props.changeImage}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Click to select file..."
                            />
                        </ReactFileReader>
                    </div>
                    <a
                        onClick={this.props.changeForm}
                        className="btn btn-default btn-fab btn-fab-mini btn-url-file"
                        data-toggle="tooltip"
                        data-placement="left"
                        data-original-title="Get Image from URL">
                        <i className="material-icons">http</i>
                    </a>
                </div>
            </div>
        );
    }
}

export default TextEditor;
