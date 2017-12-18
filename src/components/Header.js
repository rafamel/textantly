import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
    static propTypes = {
        textEditor: propTypes.boolean,
        toggle: propTypes.function
    };
    render() {
        return (
            <div className="page-header" id="banner">
                <div className="row">
                    <div className="col-xs-12">
                        <fieldset className="pull-right hidden-xs">
                            <WindowButton
                                textEditor={this.props.textEditor}
                                toggle={this.props.toggle} />
                        </fieldset>
                        <h1><a className="btn btn-primary btn-fab"><i className="material-icons">grade</i></a> Textantly</h1>
                        <p className="lead">Delicious morning coffee. A keystroke away.</p>
                    </div>
                </div>
            </div>
        );
    }
}

class WindowButton extends React.Component {
    static propTypes = {
        toggle: propTypes.function
    };
    render() {
        if (this.props.textEditor) {
            return (
                <a
                    onClick={this.props.toggle('textEditor')}
                    id="top-textantly-btn"
                    className="btn btn-default btn-fab textantly-btn"
                    data-toggle="tooltip"
                    data-placement="left"
                    data-original-title="Back to Text">
                    <i className="material-icons">text_fields</i>
                </a>
            );
        }
        return (
            <a
                onClick={this.props.toggle('textEditor')}
                id="top-edit-btn"
                className="btn btn-default btn-fab edit-btn"
                data-toggle="tooltip"
                data-placement="left"
                data-original-title="Crop & Resize">
                <i className="material-icons">edit</i>
            </a>
        );
    }
}

export default Header;
