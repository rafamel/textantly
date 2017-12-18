import React from 'react';

class ImageEditor extends React.Component {
    render() {
        return (
            <div id="edit-form">
                <div className="row">
                    <div className="col-md-12">
                        <div className="well bs-component" id="well-crop">
                            <div className="form-horizontal">
                                <div className="row">
                                    <div className="col-xs-3 col-sm-6">
                                        <legend>Crop</legend>
                                    </div>
                                    <div className="col-xs-9 col-sm-6 bs-component btn-group-sm btn-group-margin text-right">
                                        <a className="btn btn-fab btn-fab-mini-fa btn-fab-fa control-restore-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Set to Youtube Optimal Dimensions">
                                        {/* href="javascript: resetCropSelector(1280,720)" */}
                                            <i className="fa fa-youtube"></i>
                                        </a>
                                        <a className="btn btn-fab btn-fab-mini-fa btn-fab-fa control-restore-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Set to Facebook Optimal Dimensions">
                                            {/* href="javascript: resetCropSelector(1200,630)" */}
                                            <i className="fa fa-facebook"></i></a>
                                        <a className="btn  btn-fab btn-fab-mini-fa control-restore-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Set to Square Dimensions">
                                            {/* href="javascript: resetCropSelector(1,1)" */}
                                            <i className="material-icons">crop_square</i></a>
                                        <a className="btn  btn-fab btn-fab-mini-fa control-restore-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Set to Free Dimensions">
                                            {/* href="javascript: resetCropSelector(0,0)"  */}
                                            <i className="material-icons">crop_free</i>
                                        </a>
                                        <a className="btn btn-default btn-fab slide-down-btn"><i className="material-icons">keyboard_arrow_down</i></a>
                                    </div>
                                </div>
                                <fieldset>
                                    <div className="form-group">
                                        <div className="btn-group btn-group-justified btn-group-raised">
                                            <a className="btn ">Width</a>
                                            <a className="btn ">Height</a>
                                        </div>
                                        <div className="btn-group btn-group-justified">
                                            <a className="btn" id="crop-width">0</a>
                                            <a className="btn" id="crop-height">0</a>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="well bs-component">
                            <div className="form-horizontal">
                                <div className="row">
                                    <div className="col-xs-6">
                                        <legend>Resize</legend>
                                    </div>
                                    <div className="col-xs-6 bs-component btn-group-sm text-right">
                                        <a className="btn btn-default btn-fab slide-down-btn "><i className="material-icons">keyboard_arrow_down</i></a>
                                        <a className="btn btn-default btn-fab control-restore-btn" id="restore-resize" data-toggle="tooltip" data-placement="left" title="" data-original-title="Reset to Current Base Values"><i className="material-icons">settings_backup_restore</i></a>
                                    </div>
                                </div>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label htmlFor="e-width" className="control-label">Width</label>
                                                <input type="text" className="form-control" id="e-width"></input>
                                            </div>
                                        </div>
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label htmlFor="e-height" className="control-label">Height</label>
                                                <input type="text" className="form-control" id="e-height"></input>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="well bs-component" id="well-transform">
                            <div className="form-horizontal">
                                <div className="row">
                                    <div className="col-xs-6">
                                        <legend>Transform</legend>
                                    </div>
                                    <div className="col-xs-6 bs-component btn-group-sm text-right">
                                        <a className="btn btn-default btn-fab slide-down-btn "><i className="material-icons">keyboard_arrow_down</i></a>
                                        <a className="btn btn-default btn-fab control-restore-btn" id="restore-transform" data-toggle="tooltip" data-placement="left" title="" data-original-title="Reset to Current Base Values"><i className="material-icons">settings_backup_restore</i></a>
                                    </div>
                                </div>
                                <fieldset>
                                    <div className="r-btn-input">
                                        <span className="input-group-btn input-group-sm">
                                            <button type="button" className="btn btn-fab btn-fab-mini" id="horizontal-swap" data-toggle="tooltip" data-placement="right" title="" data-original-title="Horizontal Swap">
                                                <i className="material-icons">swap_horiz</i>
                                            </button>
                                        </span>
                                        <div className="form-group">
                                            <label htmlFor="i-text" className="control-label">Rotate</label>
                                            <div className="slider svert" id="e-rotate-slider"></div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <a className="btn btn-primary btn-lg btn-block btn-raised textantly-btn">Done</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageEditor;
