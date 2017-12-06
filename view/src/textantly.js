const config = require('./config');

// Font Resizing algo
function resizeText(goingUp) {
    // Prevent infinite loop
    if ($('#text-container p').text().length !== 0) {
        var currentFont = $('#text-container p').first().css('font-size');
        currentFont = parseInt(currentFont.substring(0, currentFont.length - 2));
        var divHeight = $('#text-container > div').first().height() + 1;
        var divWidth = $('#text-container > div').first().width() + 1;
        var pHeight = $('#text-container > div > div').first().height();
        var pWidth = $('#text-container > div > div').first().width();
        if (pHeight > divHeight || pWidth > divWidth) {
            $('#text-container p').first().css({'font-size': currentFont - 1});
            // eslint-disable-next-line
            if (goingUp == null || goingUp == false) {
                resizeText(false);
            }
        } else {
            $('#text-container p').first().css({'font-size': currentFont + 1});
            // eslint-disable-next-line
            if (goingUp == null || goingUp == true) {
                resizeText(true);
            } else {
                $('#text-container p').first().css({'font-size': currentFont});
            }
        }
    }
}

// UI Changes

function restoreOriginal() {
    $('canvas').detach(); // Remove previous canvas if it exists
    $('#img-container').show(); // SHow initial image
}
function startLoading() {
    $('body').addClass('loading');
    $('fieldset').prop('disabled', true);
}
function endLoading() {
    $('body').removeClass('loading');
    $('fieldset').prop('disabled', false);
}
function updateOverlay() {
    // Updates button state to #text-container
    restoreOriginal();
    if ($('#overlay-on-off').hasClass('off-overlay')) {
        $('#text-container').addClass('off-overlay');
    } else {
        $('#text-container').removeClass('off-overlay');
    }
}
function overlayOnOff() {
    // Changes button state and updates to #text-container
    restoreOriginal();
    if ($('#overlay-on-off').hasClass('off-overlay')) {
        $('#overlay-on-off').removeClass('off-overlay');
        $('#text-container').removeClass('off-overlay');
    } else {
        $('#overlay-on-off').addClass('off-overlay');
        $('#text-container').addClass('off-overlay');
    }
}

function showSnackbar(content) {
    $('.snackbar.snackbar-opened').each(function () { $(this).snackbar('hide'); });
    var options = {
        content: content,
        timeout: 8000,
        htmlAllowed: true,
        onClose: function () { }
    };
    $.snackbar(options);
}
function undoSnackbar(undoMsg, undoBtn) {
    var sbContent = '<p>' + undoMsg + ' </p>';
    if (undoBtn) {
        sbContent += ' <a href="javascript:undoImg();" class="btn btn-raised btn-primary">' + undoBtn + '</a>';
    }
    showSnackbar(sbContent);
}
function undoImg() {
    var imgContainer = '#img-container';
    var panelToUpdate = 'textantly';
    if ($('#main-form').hasClass('inactive')) {
        imgContainer = '#edit-img-container';
        panelToUpdate = 'edit';
    }
    var orImg = $(imgContainer + ' > img').detach();
    $('#undo-img img').detach().appendTo(imgContainer);
    $('#undo-img').append(orImg);
    undoSnackbar('Done!', false);
    if (panelToUpdate === 'edit') {
        if ($('#well-crop').hasClass('inactive')) {
            initEdit();
        } else {
            if (imgIsPendingAllButCropEdits($(imgContainer + ' > img'))) {
                activateAllButCrop();
            } else {
                resetCropSelector(0, 0);
            }
        }
    } else {
        $(imgContainer + ' > img').attr('class', '').attr('style', '');
        updateAll();
    }
}

// Canvas Drawing and Download
function downloadCanvas(canvasId, filename) {
    var link = document.createElement('a');
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
    document.body.appendChild(link);
    link.click();
}

// eslint-disable-next-line
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function textantlyToCanvas(download, undoMsg) {
    // download: true -> Will hide original image and place the canvas
    // download: false -> Will _replace_ the original image for the newly created canvas and move the original to #undo-img
    var imgContainer = '#img-container';
    // Prepare image
    restoreOriginal();
    $(imgContainer + ' > img').detach().prependTo(imgContainer); // Make sure the image element is before #text-container, otherwise #text-container doesn't show
    startLoading();
    $(imgContainer).addClass('nomax');
    if (download) {
        changeText();
    } else {
        $('#text-container').addClass('off-overlay');
    }
    // Render image
    var imgElContainer = $(imgContainer);
    var text = $('#i-text').val().replaceAll(' ', '-');
    var addPosition = '';
    if (!$('#overlay-on-off').hasClass('off-overlay')) {
        addPosition = '-' + $('#i-position').val();
    }
    var imageName;
    if (text === '') imageName = 'image' + addPosition + '.png';
    else imageName = text + addPosition + '.png';

    html2canvas(imgElContainer, {
        onrendered: function (canvas) {
            $(imgContainer).removeClass('nomax max-recommended-px');
            $('#displayer > .container').append(canvas);
            $('canvas').first().attr('id', 'canvas');
            if (download) {
                $(imgContainer).hide();
                downloadCanvas('canvas', imageName);
            } else {
                $('#undo-img img').detach();
                $(imgContainer + ' > img').clone().appendTo('#undo-img');
                $(imgContainer + ' > img').attr('src', document.getElementById('canvas').toDataURL());
                $('#canvas').detach();
                updateOverlay();
                changeText();
            }
            if (undoMsg) {
                undoSnackbar(undoMsg, 'Undo');
            }
            endLoading();
        }
    });
}

// Text Overlay

function changeFont() {
    restoreOriginal();
    var font = $('#i-font').val();
    var fWeight = $('#i-weight').val();
    $('head').append('<link href="//fonts.googleapis.com/css?family=' + font + '" rel="stylesheet">');
    $('head').append('<link href="//fonts.googleapis.com/css?family=' + font + ':' + fWeight + '" rel="stylesheet">');
    $('#text-container p').css({'font-family': font, 'font-weight': fWeight});
    resizeText();
}
function textAlign() {
    restoreOriginal();
    $('#text-container p').css({'text-align': $('#i-align').val()});
}
function changeTextWidth() {
    restoreOriginal();
    var position = $('#i-position').val();
    if (position === 'left' || position === 'right') {
        $('#text-container').css({'height': 'auto', 'width': $('#i-width').val()});
    } else {
        $('#text-container').css({'height': $('#i-width').val(), 'width': 'auto'});
    }
    resizeText();
}
function changePosition() {
    restoreOriginal();
    var position = $('#i-position').val();
    $('#text-container').removeClass('top right bottom left').addClass(position);
    if (position === 'left' || position === 'right') {
        $('#text-container').addClass('horizontal-bars');
        if ($('#i-width').val() === '25%') { $('#i-width').val('40%'); }
    } else {
        $('#text-container').removeClass('horizontal-bars');
        if ($('#i-width').val() === '40%') { $('#i-width').val('25%'); }
    }
    changeTextWidth();
}
function changeScheme() {
    restoreOriginal();
    if ($('#i-scheme').val() === 'dark') {
        $('#text-container').removeClass('light').addClass('dark');
    } else {
        $('#text-container').removeClass('dark').addClass('light');
    }
}
function changeText() {
    restoreOriginal();
    $('#text-container p').text($('#i-text').val());
    resizeText();
}

// Image Upload / Download
// Check Max Size
function checkMaxRecommendedSize() {
    if ($('#img-container > img').prop('naturalWidth') > config.maxSizepx) {
        $('#img-container').addClass('max-recommended-px');
        textantlyToCanvas(false, `The image was too big! It's been set to an optimal width of ${ config.maxSizepx }px.`);
    }
    restoreOriginal();
    resizeText();
}

// URL
// eslint-disable-next-line
function changeImageUrlHelper(data, imageUrl) {
    endLoading();
    if (data.slice(0, 25).split('base64')[1] && data.slice(0, 10) === 'data:image') {
        $('#img-container > img').attr('src', data).attr('data-url', imageUrl);
        checkMaxRecommendedSize();
    } else if (data.slice(0, 6) === 'Error:') {
        undoSnackbar(data, false);
    } else {
        undoSnackbar("The image couldn't be loaded.", false);
    }
}
function changeImageUrl() {
    restoreOriginal();
    // var imageUrl = $('#i-image-url').val();
    // if (imageUrl != '' && $("#img-container > img").attr("data-url") != imageUrl) {
    //     startLoading();
    //     $.ajax("get-image.php?img=" + imageUrl, {
    //         success: function(data){
    //             changeImageUrlHelper(data, imageUrl)
    //         },
    //         error: function(data) {
    //             // Sometimes when on Wordpress dir, it will error 404 while still correctly reaching the desired data
    //             changeImageUrlHelper(data.responseText, imageUrl)
    //         }
    //     });
    // }
}
// File upload
$(window).on('load', function () {
    function EL(id) { return document.getElementById(id); }
    function readFile() {
        if (this.files && this.files[0]) {
            startLoading();
            var FR = new FileReader();
            FR.onload = function (e) {
                $('#img-container > img').attr('src', e.target.result).attr('data-url', '');
                endLoading();
                checkMaxRecommendedSize();
            };
            FR.readAsDataURL(this.files[0]);
        }
    }
    EL('i-image-local').addEventListener('change', readFile, false);
});

// Update all
var updateAll = function () {
    // Call functions
    changeImageUrl();
    updateOverlay();
    changeText();
    changePosition(); // also calls changeWidth() and changeFont()
    textAlign();
    changeScheme();
};

// Crop & Edit
// Save pending Edits (for panel change)
var savePendingEdits = function (onceDone) {
    var imgEl = $('#edit-img-container > img');
    if (imgIsPendingAllButCropEdits(imgEl)) {
        editToCanvas('Previous changes were saved.', onceDone);
    } else if (imgEl.hasClass('pending-crop')) {
        imgEl.addClass('changing-wells');
        cropImage(onceDone);
    } else if (onceDone) {
        onceDone();
    }
};

// Slides
var cropTg = '#edit-form #well-crop';
var allButCropTg = '#edit-form .well:not(#well-crop):not(#edit-controls)';
var imgIsPendingAllButCropEdits = function (imgEl) { return (imgEl.hasClass('pending-resize') || imgEl.hasClass('pending-rotate') || imgEl.hasClass('h-swapped')); };
var activeInactiveWell = function (activate, other) {
    $(activate).removeClass('inactive');
    $(activate + ' fieldset').slideDown().prop('disabled', false);
    $(other).addClass('inactive');
    $(other + ' fieldset').slideUp().prop('disabled', true);
};
var activateCropHelper = function () {
    resetCropSelector(0, 0);
    activeInactiveWell(cropTg, allButCropTg);
};
var activateCrop = function () {
    var imgEl = $('#edit-img-container > img');
    if (imgIsPendingAllButCropEdits(imgEl)) {
        editToCanvas('Previous changes were saved.', activateCropHelper);
    } else {
        activateCropHelper();
    }
};
var activateAllButCropHelper = function () {
    jcrop_api.destroy();
    $('#edit-img-container > img').attr('style', '');
    activeInactiveWell(allButCropTg, cropTg);
    initEdit();
};
var activateAllButCrop = function () {
    var imgEl = $('#edit-img-container > img');
    if (imgEl.hasClass('pending-crop')) {
        imgEl.addClass('changing-wells');
        cropImage(activateAllButCropHelper);
    } else {
        activateAllButCropHelper();
    }
};

// SaveDone
var saveDoneHelper = function (imgContainer, undoMsg, onceRendered) {
    $('#canvas').detach();
    if (undoMsg) {
        undoSnackbar(undoMsg, 'Undo');
    }
    if (onceRendered) { onceRendered(); }
    endLoading();
    initEdit();
};
var saveDone = function (imgContainer, undoMsg, onceRendered, endLoadTimeout) {
    if (endLoadTimeout) {
        setTimeout(function () {
            saveDoneHelper(imgContainer, undoMsg, onceRendered);
        }, endLoadTimeout);
    } else {
        saveDoneHelper(imgContainer, undoMsg, onceRendered);
    }
};
// Save Canvas
var editToCanvas = function (undoMsg, onceRendered) {
    var imgContainer = '#edit-img-container';
    startLoading();
    // Prepare image
    if ($('#edit-img-container > img').css('max-width') === '100%'
        || !$('#edit-img-container > img').css('max-width')) {
        $(imgContainer).addClass('nomax-i');
    }
    if ($('#edit-img-container > img').hasClass('pending-rotate')) {
        $(imgContainer).addClass('saving-rotate');
        recalcContainerHeight();
        // Solve offset problem with some deg configurations
        $(imgContainer + ' > img').css({'left': $(imgContainer).offset().left - $(imgContainer + ' > img').offset().left + 'px', 'top': $(imgContainer).offset().top - $(imgContainer + ' > img').offset().top + 'px'});
    }
    // Render image
    var imgElContainer = $(imgContainer);
    html2canvas(imgElContainer, {
        onrendered: function (canvas) {
            $(imgContainer).removeClass('nomax-i saving-rotate');
            $(imgContainer + ' > img').css({'left': 0, 'top': 0});
            $('#editer > .container').append(canvas);
            $('canvas').first().attr('id', 'canvas');
            $('#undo-img img').detach();
            $(imgContainer + ' > img').clone().appendTo('#undo-img');
            $(imgContainer + ' > img').attr('src', document.getElementById('canvas').toDataURL()).attr('style', '').removeClass('pending-resize');
            if ($(imgContainer + ' > img').hasClass('h-swapped')) {
                $(imgContainer + ' > img').removeClass('h-swapped');
                swapImage(imgContainer, undoMsg, onceRendered); // Deal with swapping the image
            } else {
                restoreTransform();
                saveDone(imgContainer, undoMsg, onceRendered, false);
            }
        }
    });
};

// Horizontal Swap
var swapImage = function (imgContainer, undoMsg, onceRendered) {
    var imgEl = $(imgContainer + ' > img');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    // Clear current canvas
    context.save();
    // Use the identity matrix while clearing the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Restore the transform
    context.restore();
    // Continue
    var x = (width / 2) * -1;
    var y = ((height / 2) * -1);
    var imageObj = new Image();

    imageObj.onload = function () {
        context.save();
        // Manipulate
        context.translate(x + width, y + height);
        context.scale(-1, 1);
        // Draw
        context.drawImage(imageObj, x, y, width, height);
        context.restore();
        imgEl.attr('src', canvas.toDataURL());
    };
    imageObj.src = imgEl.attr('src');
    saveDone(imgContainer, undoMsg, onceRendered, 1000);
};
// Crop
var cropImage = function (onceLoad) {
    var imgEl = $('#edit-img-container > img');
    startLoading();
    if (imgEl.hasClass('pending-crop')) {
        var imageObj = new Image();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var imgRelativeWidth = imgEl.width();
        var imgRelativeHeight = imgEl.height();
        var imgNaturalWidth = imgEl.prop('naturalWidth');
        var imgNaturalHeight = imgEl.prop('naturalHeight');

        var selectionX = getAbsSize(
            jcrop_api.tellSelect().x, imgRelativeWidth, imgNaturalWidth
        );
        var selectionY = getAbsSize(
            jcrop_api.tellSelect().y, imgRelativeHeight, imgNaturalHeight
        );
        var selectionWidth = getAbsSize(
            jcrop_api.tellSelect().w, imgRelativeWidth, imgNaturalWidth
        );
        var selectionHeight = getAbsSize(
            jcrop_api.tellSelect().h, imgRelativeHeight, imgNaturalHeight
        );

        canvas.id = 'cropped-canvas';
        canvas.width = selectionWidth;
        canvas.height = selectionHeight;

        imageObj.src = imgEl.attr('src');

        imageObj.onload = function () {
            ctx.drawImage(imageObj,
                // jcrop_api.tellSelect().x
                selectionX, selectionY, // Start at 70/20 pixels from the left and the top of the image (crop),
                selectionWidth, selectionHeight, // "Get" a `50 * 50` (w * h) area from the source image (crop),
                0, 0, // Place the result at 0, 0 in the canvas,
                selectionWidth, selectionHeight); // With as width / height: 100 * 100 (scale)
            $('#undo-img img').detach();
            imgEl.clone().appendTo('#undo-img').attr('style', '').removeClass('pending-crop').removeClass('changing-wells');
            imgEl.attr('src', canvas.toDataURL()).removeClass('pending-crop').attr('style', '');
            saveDone('#edit-img-container', 'Cropped image has been saved.', false, 500);
            jcrop_api.destroy();
            if (imgEl.hasClass('changing-wells')) {
                imgEl.removeClass('changing-wells');
            } else {
                resetCropSelector(0, 0);
            }
            if (onceLoad) { onceLoad(); }
            endLoading();
        };
    }
};
function resetCropSelector(x, y) {
    var imgTg = '#edit-img-container > img';
    var imgHeight = $(imgTg).height();
    var imgWidth = $(imgTg).width();
    if ($('#edit-img-container .jcrop-holder').length > 0) {
        // If an instance of jcrop already exists, destroy
        jcrop_api.destroy();
    }
    var marginX1, marginY1, selX2, selY2;
    if (x === 0 || y === 0) {
        // var selX2 = Math.round((imgWidth/4)*3),
        // selY2 = Math.round((imgHeight/4)*3),
        // marginX1 = Math.round(imgWidth/4),
        // marginY1 = Math.round(imgHeight/4);
        selX2 = imgWidth;
        selY2 = imgHeight;
        marginX1 = 0;
        marginY1 = 0;
        $(imgTg).Jcrop({
            onChange: showCoords,
            onSelect: showCoords
        }, function () {
            // eslint-disable-next-line
            jcrop_api = this;
        });
    } else {
        var ratio = x / y;
        var newDim = Math.round(imgHeight * ratio);
        marginY1 = 0;
        marginX1 = Math.round((imgWidth - newDim) / 2);
        selY2 = y;
        selX2 = marginX1 + newDim;
        if (newDim > imgWidth) {
            newDim = Math.round(imgWidth / ratio);
            marginX1 = 0;
            marginY1 = Math.round((imgHeight - newDim) / 2);
            selX2 = x;
            selY2 = marginY1 + newDim;
        }
        $(imgTg).Jcrop({
            onChange: showCoords,
            onSelect: showCoords,
            aspectRatio: ratio
        }, function () {
            // eslint-disable-next-line
            jcrop_api = this;
        });
    }
    // eslint-disable-next-line
    jcrop_api.setSelect([ marginX1, marginY1, selX2, selY2 ]);
}

// Rotate helpers
var recalcContainerHeight = function () {
    if ($('#edit-img-container > img').hasClass('pending-rotate')) {
        var recHeight = $('#edit-img-container > img').height();
        var recWidth = $('#edit-img-container > img').width();
        $('#edit-img-container').css({'height': recHeight + 'px', 'width': recWidth});
    } else {
        $('#edit-img-container > img').css({'max-width': '100%', 'max-height': 'none'});
    }
};
function checkPendingRotate(func) {
    if ($('#edit-img-container > img').hasClass('pending-rotate')) {
        editToCanvas('Previous changes were saved.', func);
    } else if (func) {
        func();
    }
}

// Resize helpers
function flushThis(target) {
    var parent = target.parent().removeClass('is-focused');
    var pHtml = target.parent().html();
    parent.children().detach();
    parent.html(pHtml);
}

function flushFields() {
    flushThis($('#e-width'));
    flushThis($('#e-height'));
    // Re-bind
    $('#e-width').on('change', function () { eResize('width'); });
    $('#e-width').focusin(function () { checkPendingRotate(false); });
    $('#e-height').on('change', function () { eResize('height'); });
    $('#e-height').focusin(function () { checkPendingRotate(false); });
}

// Restore values
function restoreResize() {
    $('#edit-img-container > img').css({'max-width': '100%', 'max-height': 'none'}).removeClass('pending-resize');
    initEdit();
}
function restoreTransform() {
    var rotateSlider = document.getElementById('e-rotate-slider');
    rotateSlider.noUiSlider.set(0.00);
    $('#edit-img-container').css({'height': 'auto', 'width': 'auto'});
    $('#edit-img-container > img').css({'transform': ''}).removeClass('pending-rotate').attr('data-rotate', '');
}

function initEdit() {
    $('#edit-img-container > img').removeClass('pending-resize');
    var naturalWidth = $('#edit-img-container > img').prop('naturalWidth');
    var naturalHeight = $('#edit-img-container > img').prop('naturalHeight');
    $('#e-width').attr('value', naturalWidth).attr('placeholder', naturalWidth);
    $('#e-height').attr('value', naturalHeight).attr('placeholder', naturalHeight);
    flushFields();
    if ($('#edit-img-container > img').hasClass('pending-rotate')) {
        var rotateSlider = document.getElementById('e-rotate-slider');
        rotateSlider.noUiSlider.set($('#edit-img-container > img').attr('data-rotate'));
        rotate(); // Also calls recalcContainerHeight();
    } else {
        restoreTransform();
        recalcContainerHeight();
    }
}
// Crop

function getAbsSize(selectionSize, relativeSize, naturalSize) {
    // eslint-disable-next-line
    if (relativeSize != naturalSize) {
        return Math.round((selectionSize * naturalSize) / relativeSize);
    } else {
        return Math.round(selectionSize);
    }
}
function showCoords(c) {
    // Only pending-crop if not full sized selection or no selection
    var width = c.w;
    var height = c.h;
    var imageWidth = $('#edit-img-container > img').width();
    var imageHeight = $('#edit-img-container > img').height();
    if ((imageHeight === height && imageWidth === width) || height === 0 || width === 0) {
        $('#edit-img-container > img').removeClass('pending-crop');
    } else {
        $('#edit-img-container > img').addClass('pending-crop');
    }
    // Recalc width/height if image shown doesn't have its natural size
    var naturalWidth = $('#edit-img-container > img').prop('naturalWidth');
    var naturalHeight = $('#edit-img-container > img').prop('naturalHeight');
    width = getAbsSize(width, imageWidth, naturalWidth);
    height = getAbsSize(height, imageHeight, naturalHeight);
    // Write
    $('#crop-width').text(width);
    $('#crop-height').text(height);
};

// Resize
function changeWidthHeight() {
    var currentWidth = $('#edit-img-container > img').width();
    var currentHeight = $('#edit-img-container > img').height();
    $('#e-width').attr('value', currentWidth);
    $('#e-height').attr('value', currentHeight);
    flushFields();
}
function changeWidth() {
    var naturalWidth = $('#edit-img-container > img').removeClass('pending-resize').prop('naturalWidth');
    var newWidth = $('#e-width').val();
    if (newWidth > naturalWidth) {
        restoreResize();
    } else if (newWidth > $('#editer > .container').width()) {
        $('#edit-img-container > img').css({'max-width': newWidth + 'px', 'max-height': 'none'}).addClass('pending-resize');
        changeWidthHeight();
        $('#edit-img-container > img').css({'max-width': '100%', 'max-height': 'none'});
    } else {
        $('#edit-img-container > img').css({'max-width': newWidth + 'px', 'max-height': 'none'}).addClass('pending-resize');
        changeWidthHeight();
    }
}
function changeHeight() {
    var naturalHeight = $('#edit-img-container > img').removeClass('pending-resize').prop('naturalHeight');
    var newHeight = $('#e-height').val();
    if (newHeight > naturalHeight) {
        restoreResize();
    }
    $('#edit-img-container > img').css({'max-width': 'none', 'max-height': newHeight + 'px'}).addClass('pending-resize');
    changeWidthHeight();
    var newWidth = $('#edit-img-container > img').width();
    if (newWidth > $('#editer > .container').width()) {
        $('#edit-img-container > img').css({'max-width': '100%', 'max-height': 'none'});
    }
}
function eResize(widthOrHeight) {
    if (widthOrHeight === 'height') {
        checkPendingRotate(changeHeight);
    } else {
        checkPendingRotate(changeWidth);
    }
}

// Transforms
function rotate() {
    $('#edit-img-container > img').addClass('pending-rotate').css({'transform': 'rotate(' + $('#edit-img-container > img').attr('data-rotate') + 'deg)'});
    recalcContainerHeight();
}
function rotateChecks(deg) {
    // eslint-disable-next-line
    if (deg != '0') {
        $('#edit-img-container > img').attr('data-rotate', deg);
        if ($('#edit-img-container > img').hasClass('h-swapped')) {
            var rcMsg;
            if ($('#edit-img-container > img').hasClass('pending-resize')) {
                rcMsg = 'Horizontal swap and resize were saved.';
            } else rcMsg = 'Horizontal swap was saved.';
            editToCanvas(rcMsg, rotate);
        } else {
            rotate();
        }
    }
}
function horizontalSwap() {
    // Run with checkPendingRotate(horizontalSwap);
    if ($('#edit-img-container > img').hasClass('h-swapped')) {
        $('#edit-img-container > img').removeClass('h-swapped');
    } else {
        $('#edit-img-container > img').addClass('h-swapped');
    }
}

// Button/Input bindings
$(window).on('load', function () {
    // Panel Change
    $('.edit-btn').on('click', function () {
        $('#top-textantly-btn').removeClass('hidden');
        $('#top-edit-btn').addClass('hidden');
        $('#main-form').addClass('inactive');
        $('#edit-form').removeClass('inactive');
        $('#displayer').hide();
        $('#editer').show();
        $('#img-container > img').detach().appendTo('#edit-img-container').attr('style', '');
        initEdit();
        activateCrop();
    });
    var changeToTextantlyHelper = function () {
        jcrop_api.destroy();
        $('#top-textantly-btn').addClass('hidden');
        $('#top-edit-btn').removeClass('hidden');
        $('#edit-form').addClass('inactive');
        $('#main-form').removeClass('inactive');
        $('#editer').hide();
        $('#displayer').show();
        $('#edit-img-container > img').detach().appendTo('#img-container').attr('style', '');
        updateAll();
    };
    $('.textantly-btn').on('click', function () {
        // $(".snackbar").each(function(){ $(this).snackbar("hide"); });
        savePendingEdits(changeToTextantlyHelper);
    });

    // Textantly
    $('#update-overlay').on('click', function () { updateOverlay(); });
    $('#i-font').on('change', function () { changeFont(); });
    $('#i-weight').on('change', function () { changeFont(); });
    $('#i-align').on('change', function () { textAlign(); });
    $('#i-position').on('change', function () { changePosition(); });
    $('#i-width').on('change', function () { changeTextWidth(); });
    $('#i-scheme').on('change', function () { changeScheme(); });
    $('#i-image-url').on('change', function () { changeImageUrl(); });
    $('#i-text').on('change', function () { changeText(); });

    // File upload or url btns
    $('#url-form .btn-url-file').on('click', function () {
        $('#url-form').hide();
        $('#file-form').show();
    });
    $('#file-form .btn-url-file').on('click', function () {
        $('#file-form').hide();
        $('#url-form').show();
    });

    // Update & Download
    // $("#update-btn").on('click', function(){ updateAll(); });
    $('#download-btn').on('click', function () {
        // Download image on click
        textantlyToCanvas(true, false);
    });
});

// Edit & Crop
$(window).on('load', function () {
    $(cropTg).on('click', function () {
        if ($(this).hasClass('inactive')) { activateCrop(); }
    });
    $(allButCropTg).on('click', function () {
        if ($(this).hasClass('inactive')) { activateAllButCrop(); }
    });
});

$(window).on('load', function () {
    // Restores
    $('#restore-resize').on('click', function () { restoreResize(); });
    $('#restore-transform').on('click', function () { restoreTransform(); });
    // Swap
    $('#horizontal-swap').on('click', function () { checkPendingRotate(horizontalSwap); });
    // Sliders
    var rotateSlider = document.getElementById('e-rotate-slider');
    noUiSlider.create(rotateSlider, {
        start: 0,
        step: 15,
        range: {
            'min': -180,
            'max': 180
        }
    });
    rotateSlider.noUiSlider.on('change', function () {
        rotateChecks(this.get().split('.')[0]);
    });
});

// Initialization
$(window).on('load', function () {
    // Initialize tooltips
    // css -> .tooltip.fade { transition: none }
    var tooltipTimeout,
        tooltimeTimeIn;
    $("[data-toggle='tooltip']").tooltip({
        // delay: {show: 0, hide: 300}
        // animation: true
    }).hover(function () {
        $('.tooltip').hide();
        var tooltipEl = $('#' + $(this).attr('aria-describedby'));
        clearTimeout(tooltimeTimeIn);
        tooltimeTimeIn = setTimeout(function () { tooltipEl.fadeIn(); }, 600);
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(function () { tooltipEl.removeClass('.active-tooltip').fadeOut(); }, 2200);
    });
    // Init Material Design lib
    $.material.init();
    // Adapt font size
    resizeText();
    // SLide up all wells but crop in image edit
    activeInactiveWell(cropTg, allButCropTg);
});

// Globals
global.overlayOnOff = overlayOnOff;
global.changeImageUrl = changeImageUrl;
global.updateAll = updateAll;
global.resetCropSelector = resetCropSelector;
global.undoImg = undoImg;
