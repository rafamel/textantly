<?php

$max_recommended_size_px = "1200";

// Ensure User Logged in @ Wordpress
require_once($_SERVER['DOCUMENT_ROOT'].'/wp-blog-header.php');
if ((!is_user_logged_in()) || (!current_user_can("edit_posts"))) {
	echo "Error: User not logged in or without authorization.";
	exit;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
<title>Textantly</title>

	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/9.0.0/nouislider.min.js"></script>
	<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="bootstrap-material-design-0510/material.min.js"></script>
	<script type="text/javascript" src="bootstrap-material-design-0510/ripples.min.js"></script>
	<script type="text/javascript" src="snackbarjs-11/snackbar.min.js"></script>
	<script type="text/javascript" src="http://jcrop-cdn.tapmodo.com/v0.9.12/js/jquery.Jcrop.min.js"></script>
	<script type="text/javascript">

		// Font Resizing algo
		var resizeText = function(goingUp){
			if($("#text-container p").text().length != 0) { // Prevent infinite loop
				var currentFont = $("#text-container p").first().css("font-size");
				currentFont = parseInt(currentFont.substring(0, currentFont.length - 2));
				var divHeight = $("#text-container > div").first().height()+1;
				var divWidth = $("#text-container > div").first().width()+1;
				var pHeight = $("#text-container > div > div").first().height();
				var pWidth = $("#text-container > div > div").first().width();
				if (pHeight > divHeight || pWidth > divWidth) {
					$("#text-container p").first().css({"font-size": currentFont-1});
					if(goingUp == null || goingUp == false) {
						resizeText(false);
					}
				} else {
					$("#text-container p").first().css({"font-size": currentFont+1});
					if(goingUp == null || goingUp == true) {
						resizeText(true);
					} else {
						$("#text-container p").first().css({"font-size": currentFont});
					}
				}
			}
		}

		// UI Changes

		var restoreOriginal = function() {
			$("canvas").detach(); // Remove previous canvas if it exists
			$("#img-container").show(); // SHow initial image
		}
		var startLoading = function() {
			$("body").addClass("loading");
			$("fieldset").prop('disabled', true);
		}
		var endLoading = function() {
			$("body").removeClass("loading");
			$("fieldset").prop('disabled', false);
		}
		var updateOverlay = function() {
			// Updates button state to #text-container
			restoreOriginal();
			if ($("#overlay-on-off").hasClass("off-overlay")) {
				$("#text-container").addClass("off-overlay");
			} else {
				$("#text-container").removeClass("off-overlay");
			}
		}
		var overlayOnOff = function() {
			// Changes button state and updates to #text-container
			restoreOriginal();
			if ($("#overlay-on-off").hasClass("off-overlay")) {
				$("#overlay-on-off").removeClass("off-overlay");
				$("#text-container").removeClass("off-overlay");
			} else {
				$("#overlay-on-off").addClass("off-overlay");
				$("#text-container").addClass("off-overlay");
			}
		}

		var showSnackbar = function(content) {
			$(".snackbar.snackbar-opened").each(function(){ $(this).snackbar("hide"); });
			var options =  {
			    content: content,
			    timeout: 8000,
			    htmlAllowed: true,
			    onClose: function(){ }
			}
			$.snackbar(options);
		}
		var undoSnackbar = function(undoMsg, undoBtn) {
			var sbContent = '<p>' + undoMsg + ' </p>';
			if (undoBtn) {
				sbContent += ' <a href="javascript:undoImg();" class="btn btn-raised btn-primary">' + undoBtn + '</a>';
			}
			showSnackbar(sbContent);
		}
		var undoImg = function() {
			var imgContainer = "#img-container";
			var panelToUpdate = "textantly";
			if($("#main-form").hasClass("inactive")) {
				imgContainer = "#edit-img-container";
				panelToUpdate = "edit";
			}
    		var orImg = $(imgContainer + " > img").detach();
    		$("#undo-img img").detach().appendTo(imgContainer);
    		$("#undo-img").append(orImg);
    		undoSnackbar("Done!", false);
    		if (panelToUpdate === "edit") {
    			if($("#well-crop").hasClass("inactive")) {
    				initEdit();
    			} else {
    				if (imgIsPendingAllButCropEdits($(imgContainer + " > img"))) {
    					activateAllButCrop();
    				} else {
						resetCropSelector(0,0);
    				}
    			}
    		} else {
    			$(imgContainer + " > img").attr("class", '').attr("style", '');
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

		String.prototype.replaceAll = function(search, replacement) {
		    var target = this;
		    return target.split(search).join(replacement);
		};

		var textantlyToCanvas = function(download, undoMsg) {
			// download: true -> Will hide original image and place the canvas
			// download: false -> Will _replace_ the original image for the newly created canvas and move the original to #undo-img
			var imgContainer = "#img-container";
			// Prepare image
			restoreOriginal();
			$(imgContainer + " > img").detach().prependTo(imgContainer); // Make sure the image element is before #text-container, otherwise #text-container doesn't show
			startLoading();
			$(imgContainer).addClass("nomax");
			if (download) {
				changeText();
			} else {
				$("#text-container").addClass("off-overlay");
			}
			// Render image
			var imgElContainer = $(imgContainer);
			var text = $('#i-text').val().replaceAll(" ", "-");
			var addPosition = "";
			if (!$("#overlay-on-off").hasClass("off-overlay")) {
				addPosition = '-' + $('#i-position').val()
			}
			if (text === '') { var imageName = "image" + addPosition + ".png"; } else {
				var imageName = text + addPosition + '.png';
			}
			html2canvas(imgElContainer, {
			    onrendered: function(canvas) {
			    	$(imgContainer).removeClass("nomax max-recommended-px");
		    		$("#displayer > .container").append(canvas);
		    		$("canvas").first().attr("id", "canvas");
			    	if (download) {
			    		$(imgContainer).hide();
			    		downloadCanvas('canvas', imageName);
			    	} else {
			    		$("#undo-img img").detach();
			    		$(imgContainer + " > img").clone().appendTo("#undo-img");
			    		$(imgContainer + " > img").attr("src", document.getElementById('canvas').toDataURL());
			    		$("#canvas").detach();
			    		updateOverlay();
			    		changeText();
			    	}
		    		if (undoMsg) {
		    			undoSnackbar(undoMsg, "Undo");
		    		}
					endLoading();
			    }
			});
		}


		// Text Overlay

		var changeFont = function() {
			restoreOriginal();
			var font = $('#i-font').val();
			var fWeight = $('#i-weight').val();
			$('head').append('<link href="//fonts.googleapis.com/css?family=' + font + '" rel="stylesheet">');
			$('head').append('<link href="//fonts.googleapis.com/css?family=' + font + ':' + fWeight + '" rel="stylesheet">');
			$("#text-container p").css({"font-family": font, "font-weight": fWeight});
			resizeText();
		}
		var textAlign = function() {
			restoreOriginal();
			$("#text-container p").css({"text-align": $('#i-align').val()});
		}
		var changeTextWidth = function() {
			restoreOriginal();
			var position = $('#i-position').val();
			if (position === "left" || position === "right") {
				$("#text-container").css({"height": "auto", "width": $('#i-width').val()});
			} else {
				$("#text-container").css({"height": $('#i-width').val(), "width": "auto"});
			}
			resizeText();
		}
		var changePosition = function() {
			restoreOriginal();
			var position = $('#i-position').val();
			$("#text-container").removeClass("top right bottom left").addClass(position);
			if (position === "left" || position === "right") {
				$("#text-container").addClass("horizontal-bars");
				if ($('#i-width').val() === "25%") { $('#i-width').val("40%"); }
			} else {
				$("#text-container").removeClass("horizontal-bars");
				if ($('#i-width').val() === "40%") { $('#i-width').val("25%"); }
			}
			changeTextWidth();
		}
		var changeScheme = function() {
			restoreOriginal();
			if($('#i-scheme').val() === "dark") {
				$("#text-container").removeClass("light").addClass("dark");
			} else {
				$("#text-container").removeClass("dark").addClass("light");
			}
		}
		var changeText = function() {
			restoreOriginal();
			$("#text-container p").text($("#i-text").val());
			resizeText();
		}


		// Image Upload / Download
			// Check Max Size
		var checkMaxRecommendedSize = function() {
			if ($("#img-container > img").prop("naturalWidth") > <?php echo $max_recommended_size_px; ?>) {
				$("#img-container").addClass("max-recommended-px");
				textantlyToCanvas(false, 'The image was too big! It\'s been set to an optimal width of <?php echo $max_recommended_size_px; ?>px.');
			}
			restoreOriginal();
			resizeText();
		}

			// URL
		var changeImageUrlHelper = function(data, imageUrl) {
			endLoading();
			if (data.slice(0,25).split("base64")[1] && data.slice(0,10) === "data:image") {
				$("#img-container > img").attr("src", data).attr("data-url", imageUrl);
				checkMaxRecommendedSize();
			} else if (data.slice(0,6) === "Error:") {
				undoSnackbar(data, false);
			} else {
	        	undoSnackbar("The image couldn't be loaded.", false);
			}
		}
		var changeImageUrl = function() {
			restoreOriginal();
			var imageUrl = $("#i-image-url").val();
			if (imageUrl != '' && $("#img-container > img").attr("data-url") != imageUrl) {
				startLoading();
				$.ajax("get-image.php?img=" + imageUrl, {
					success: function(data){
						changeImageUrlHelper(data, imageUrl)
					},
			        error: function(data) {
			        	// Sometimes when on Wordpress dir, it will error 404 while still correctly reaching the desired data
						changeImageUrlHelper(data.responseText, imageUrl)
			        }
			   });
			}
		}
			// File upload
		$(window).on("load", function() {
			function EL(id) { return document.getElementById(id); }
			function readFile() {
			    if (this.files && this.files[0]) {
			    	startLoading();
				    var FR = new FileReader();
				    FR.onload = function(e) {
				        $("#img-container > img").attr("src", e.target.result).attr("data-url", "");
						endLoading();
						checkMaxRecommendedSize();
				    };
				    FR.readAsDataURL( this.files[0] );
			    }
			}
			EL("i-image-local").addEventListener("change", readFile, false);
		});

		// Update all
		var updateAll = function() {
			// Call functions
			changeImageUrl();
			updateOverlay();
			changeText();
			changePosition(); // also calls changeWidth() and changeFont()
			textAlign();
			changeScheme();
		}



		// Crop & Edit
				// Save pending Edits (for panel change)
		var savePendingEdits = function(onceDone) {
			var imgEl = $("#edit-img-container > img");
			if (imgIsPendingAllButCropEdits(imgEl)) {
				editToCanvas("Previous changes were saved.", onceDone)
			} else if (imgEl.hasClass("pending-crop")) {
				imgEl.addClass("changing-wells");
				cropImage(onceDone);
			} else if (onceDone) {
				onceDone();
			}
		}

				// Slides
		var cropTg = "#edit-form #well-crop";
		var allButCropTg = "#edit-form .well:not(#well-crop):not(#edit-controls)";
		var imgIsPendingAllButCropEdits = function(imgEl) { return (imgEl.hasClass("pending-resize") || imgEl.hasClass("pending-rotate") || imgEl.hasClass("h-swapped")); }
		var activeInactiveWell = function(activate, other) {
			$(activate).removeClass("inactive");
			$(activate + " fieldset").slideDown().prop('disabled', false);
			$(other).addClass("inactive");
			$(other + " fieldset").slideUp().prop('disabled', true);
		}
		var activateCropHelper = function() {
			resetCropSelector(0,0);
			activeInactiveWell(cropTg, allButCropTg);
		}
		var activateCrop = function() {
			var imgEl = $("#edit-img-container > img");
			if (imgIsPendingAllButCropEdits(imgEl)) {
				editToCanvas("Previous changes were saved.", activateCropHelper);
			} else {
				activateCropHelper();
			}
		}
		var activateAllButCropHelper = function() {
			jcrop_api.destroy();
			$("#edit-img-container > img").attr("style", "");
			activeInactiveWell(allButCropTg, cropTg);
			initEdit();
		}
		var activateAllButCrop = function() {
			var imgEl = $("#edit-img-container > img");
			if (imgEl.hasClass("pending-crop")) {
				imgEl.addClass("changing-wells");
				cropImage(activateAllButCropHelper);
			} else {
				activateAllButCropHelper();
			}
		}


			// SaveDone
		var saveDoneHelper = function(imgContainer, undoMsg, onceRendered) {
			$("#canvas").detach();
			if (undoMsg) {
    			undoSnackbar(undoMsg, "Undo");
    		}
			if (onceRendered) { onceRendered(); }
			endLoading();
			initEdit();
		}
		var saveDone = function(imgContainer, undoMsg, onceRendered, endLoadTimeout) {
    		if (endLoadTimeout) {
    			setTimeout(function() { saveDoneHelper(imgContainer, undoMsg, onceRendered); }, endLoadTimeout);
    		} else {
    			saveDoneHelper(imgContainer, undoMsg, onceRendered);
    		}
		}
			// Save Canvas
		var editToCanvas = function(undoMsg, onceRendered) {
			var imgContainer = "#edit-img-container";
			startLoading();
			// Prepare image
			if ($("#edit-img-container > img").css("max-width") === "100%" || !$("#edit-img-container > img").css("max-width")) {
				$(imgContainer).addClass("nomax-i");
			}
			if($("#edit-img-container > img").hasClass("pending-rotate")) {
				$(imgContainer).addClass("saving-rotate");
				recalcContainerHeight();
				// Solve offset problem with some deg configurations
				$(imgContainer + " > img").css({"left": $(imgContainer).offset().left - $(imgContainer + " > img").offset().left + "px", "top": $(imgContainer).offset().top - $(imgContainer + " > img").offset().top + "px"});
			}
			// Render image
			var imgElContainer = $(imgContainer);
			html2canvas(imgElContainer, {
			    onrendered: function(canvas) {
			    	$(imgContainer).removeClass("nomax-i saving-rotate");
			    	$(imgContainer + " > img").css({"left": 0, "top": 0});
		    		$("#editer > .container").append(canvas);
		    		$("canvas").first().attr("id", "canvas");
		    		$("#undo-img img").detach();
		    		$(imgContainer + " > img").clone().appendTo("#undo-img");
		    		$(imgContainer + " > img").attr("src", document.getElementById('canvas').toDataURL()).attr("style", '').removeClass("pending-resize");
		    		if ($(imgContainer + " > img").hasClass("h-swapped")) {
		    			$(imgContainer + " > img").removeClass("h-swapped");
		    			swapImage(imgContainer, undoMsg, onceRendered); // Deal with swapping the image
		    		} else {
		    			restoreTransform();
		    			saveDone(imgContainer, undoMsg, onceRendered, false);
					}
			    }
			});
		}

		// Horizontal Swap
		var swapImage = function(imgContainer, undoMsg, onceRendered) {
			imgEl = $(imgContainer + " > img");
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
		    var x = (width/2) * -1;
		    var y = ((height/2) * -1);
			var imageObj = new Image();

			imageObj.onload = function() {
				context.save();
				// Manipulate
				context.translate(x + width, y + height);
				context.scale(-1, 1);
				// Draw
				context.drawImage(imageObj, x, y, width, height);
				context.restore();
				imgEl.attr("src", canvas.toDataURL());
			};
			imageObj.src = imgEl.attr('src');
		    saveDone(imgContainer, undoMsg, onceRendered, 1000);
		}
		// Crop
		var cropImage = function(onceLoad) {
			var imgEl = $( "#edit-img-container > img");
			startLoading();
			if (imgEl.hasClass("pending-crop")) {
				var imageObj = new Image(),
				canvas = document.createElement('canvas'),
			    ctx = canvas.getContext('2d'),

			    imgRelativeWidth = imgEl.width(),
			    imgRelativeHeight = imgEl.height(),
			    imgNaturalWidth = imgEl.prop("naturalWidth"),
			    imgNaturalHeight = imgEl.prop("naturalHeight"),
			    selectionX = getAbsSize(jcrop_api.tellSelect().x, imgRelativeWidth, imgNaturalWidth),
			    selectionY = getAbsSize(jcrop_api.tellSelect().y, imgRelativeHeight, imgNaturalHeight),
			    selectionWidth = getAbsSize(jcrop_api.tellSelect().w, imgRelativeWidth, imgNaturalWidth),
			    selectionHeight = getAbsSize(jcrop_api.tellSelect().h, imgRelativeHeight, imgNaturalHeight);

			    canvas.id = "cropped-canvas";
			    canvas.width = selectionWidth;
			    canvas.height = selectionHeight;

				imageObj.src = imgEl.attr('src');

				imageObj.onload = function(){
				    ctx.drawImage(imageObj,
				    	//jcrop_api.tellSelect().x
				        selectionX, selectionY,   // Start at 70/20 pixels from the left and the top of the image (crop),
				        selectionWidth, selectionHeight,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
				        0, 0,     // Place the result at 0, 0 in the canvas,
				        selectionWidth, selectionHeight); // With as width / height: 100 * 100 (scale)
			    	$("#undo-img img").detach();
			    	imgEl.clone().appendTo("#undo-img").attr("style", '').removeClass("pending-crop").removeClass("changing-wells");
					imgEl.attr("src", canvas.toDataURL()).removeClass("pending-crop").attr("style", '');
			    	saveDone("#edit-img-container", "Cropped image has been saved.", false, 500);
			    	jcrop_api.destroy();
			    	if (imgEl.hasClass("changing-wells")) {
			    		imgEl.removeClass("changing-wells");
			    	} else {
						resetCropSelector(0,0);
			    	}
			    	if (onceLoad) { onceLoad(); }
			    	endLoading();
				}
			}
		}
		var resetCropSelector = function(x, y) {
			var imgTg = "#edit-img-container > img",
			imgHeight = $(imgTg).height(),
			imgWidth = $(imgTg).width();
			if($("#edit-img-container .jcrop-holder").length > 0) {
				// If an instance of jcrop already exists, destroy
				jcrop_api.destroy();
			}
			if(x === 0 || y === 0) {
				// var selX2 = Math.round((imgWidth/4)*3),
				// selY2 = Math.round((imgHeight/4)*3),
				// marginX1 = Math.round(imgWidth/4),
				// marginY1 = Math.round(imgHeight/4);
				var selX2 = imgWidth,
				selY2 = imgHeight,
				marginX1 = 0,
				marginY1 = 0;
				$(imgTg).Jcrop({
					onChange: showCoords,
					onSelect: showCoords
				}, function(){ jcrop_api = this; });
			} else {
				var ratio = x/y,
				newDim = Math.round(imgHeight*ratio),
				marginY1 = 0,
				marginX1 = Math.round((imgWidth - newDim) / 2),
				selY2 = y,
				selX2 = marginX1 + newDim;
				if(newDim > imgWidth) {
					newDim = Math.round(imgWidth/ratio);
					marginX1 = 0;
					marginY1 = Math.round((imgHeight - newDim) / 2);
					selX2 = x;
					selY2 = marginY1 + newDim;
				}
				$(imgTg).Jcrop({
					onChange: showCoords,
					onSelect: showCoords,
					aspectRatio: ratio
				}, function(){ jcrop_api = this; });
			}
			jcrop_api.setSelect([ marginX1, marginY1, selX2, selY2 ]);
		}

			// Rotate helpers
		var recalcContainerHeight = function() {
			if ($("#edit-img-container > img").hasClass("pending-rotate")) {
				var recHeight = $("#edit-img-container > img").height();
				var recWidth = $("#edit-img-container > img").width();
				$("#edit-img-container").css({"height": recHeight + "px", "width": recWidth});
			} else {
				$("#edit-img-container > img").css({"max-width": "100%", "max-height": "none"});
			}
		}
		var checkPendingRotate = function(func) {
			if($("#edit-img-container > img").hasClass("pending-rotate")) {
				editToCanvas("Previous changes were saved.", func);
			} else if(func) {
				func();
			}
		}


			// Resize helpers
		var flushThis = function(target){
			var parent = target.parent().removeClass("is-focused");
			var pHtml = target.parent().html();
			parent.children().detach();
			parent.html(pHtml);
		}

		var flushFields = function(){
			flushThis($('#e-width'));
			flushThis($('#e-height'));
			// Re-bind
			$('#e-width').on('change', function(){ eResize("width"); });
			$('#e-width').focusin(function(){ checkPendingRotate(false); });
			$('#e-height').on('change', function(){ eResize("height"); });
			$('#e-height').focusin(function(){ checkPendingRotate(false); });
		}

			// Restore values
		var restoreResize = function() {
			$("#edit-img-container > img").css({"max-width": "100%", "max-height": "none"}).removeClass("pending-resize");
			initEdit();
		}
		var restoreTransform = function() {
			var rotateSlider = document.getElementById('e-rotate-slider');
			rotateSlider.noUiSlider.set(0.00);
			$("#edit-img-container").css({"height": "auto", "width": "auto"});
			$("#edit-img-container > img").css({"transform": ''}).removeClass("pending-rotate").attr("data-rotate", '');
		}

		var initEdit = function() {
			$("#edit-img-container > img").removeClass("pending-resize");
			var naturalWidth = $("#edit-img-container > img").prop("naturalWidth");
			var naturalHeight = $("#edit-img-container > img").prop("naturalHeight");
			$("#e-width").attr("value", naturalWidth).attr("placeholder", naturalWidth);
			$("#e-height").attr("value", naturalHeight).attr("placeholder", naturalHeight);
			flushFields();
			if($("#edit-img-container > img").hasClass("pending-rotate")) {
				var rotateSlider = document.getElementById('e-rotate-slider');
				rotateSlider.noUiSlider.set($("#edit-img-container > img").attr("data-rotate"));
				rotate(); // Also calls recalcContainerHeight();
			} else {
				restoreTransform();
				recalcContainerHeight();
			}
		}
			// Crop

		var getAbsSize = function(selectionSize, relativeSize, naturalSize) {
			if (relativeSize != naturalSize) {
				return Math.round((selectionSize * naturalSize) / relativeSize);
			} else {
				return Math.round(selectionSize);
			}
		}
		var showCoords = function(c) {
			// Only pending-crop if not full sized selection or no selection
			var width = c.w;
			var height = c.h;
			var imageWidth = $("#edit-img-container > img").width();
			var imageHeight = $("#edit-img-container > img").height();
			if((imageHeight === height && imageWidth === width) || height === 0 || width === 0) {
				$("#edit-img-container > img").removeClass("pending-crop");
			} else {
				$("#edit-img-container > img").addClass("pending-crop");
			}
			// Recalc width/height if image shown doesn't have its natural size
			var naturalWidth = $("#edit-img-container > img").prop("naturalWidth");
			var naturalHeight = $("#edit-img-container > img").prop("naturalHeight");
			width = getAbsSize(width, imageWidth, naturalWidth);
			height = getAbsSize(height, imageHeight, naturalHeight);
			// Write
			$('#crop-width').text(width);
			$('#crop-height').text(height);
		};

			// Resize
		var changeWidthHeight = function() {
			var currentWidth = $("#edit-img-container > img").width();
			var currentHeight = $("#edit-img-container > img").height();
			$("#e-width").attr("value", currentWidth);
			$("#e-height").attr("value", currentHeight);
			flushFields();
		}
		var changeWidth = function() {
			var naturalWidth = $("#edit-img-container > img").removeClass("pending-resize").prop("naturalWidth");
			var newWidth = $("#e-width").val();
			if (newWidth > naturalWidth) {
				restoreResize();
			} else if (newWidth > $("#editer > .container").width()) {
				$("#edit-img-container > img").css({"max-width": newWidth + "px", "max-height": "none"}).addClass("pending-resize");
				changeWidthHeight();
				$("#edit-img-container > img").css({"max-width": "100%", "max-height": "none"});
			} else {
				$("#edit-img-container > img").css({"max-width": newWidth + "px", "max-height": "none"}).addClass("pending-resize");
				changeWidthHeight();
			}
		}
		var changeHeight = function() {
			var naturalHeight = $("#edit-img-container > img").removeClass("pending-resize").prop("naturalHeight");
			var newHeight = $("#e-height").val();
			if (newHeight > naturalHeight) {
				restoreResize();
			}
			$("#edit-img-container > img").css({"max-width": "none", "max-height": newHeight + "px"}).addClass("pending-resize");
			changeWidthHeight();
			var newWidth = $("#edit-img-container > img").width();
			if (newWidth > $("#editer > .container").width()) {
				$("#edit-img-container > img").css({"max-width": "100%", "max-height": "none"});
			}
		}
		var eResize = function(width_or_height) {
			if(width_or_height === "height") {
				checkPendingRotate(changeHeight);
			} else {
				checkPendingRotate(changeWidth);
			}
		}

			// Transforms
		var rotate = function () {
			$("#edit-img-container > img").addClass("pending-rotate").css({"transform": "rotate(" + $("#edit-img-container > img").attr("data-rotate") + "deg)"});
			recalcContainerHeight();
		}
		var rotateChecks = function(deg) {
			if(deg != "0") {
				$("#edit-img-container > img").attr("data-rotate", deg);
				if ($("#edit-img-container > img").hasClass("h-swapped")) {
					if ($("#edit-img-container > img").hasClass("pending-resize")) {
						var rcMsg = "Horizontal swap and resize were saved.";
					} else { var rcMsg = "Horizontal swap was saved."; }
					editToCanvas(rcMsg, rotate);
				} else {
					rotate();
				}
			}
		}
		var horizontalSwap = function() {
			// Run with checkPendingRotate(horizontalSwap);
			if ($("#edit-img-container > img").hasClass("h-swapped")) {
				$("#edit-img-container > img").removeClass("h-swapped");
			} else {
				$("#edit-img-container > img").addClass("h-swapped");
			}
		}


		// Button/Input bindings
		$(window).on("load", function() {

			// Panel Change
			$('.edit-btn').on('click', function(){
				$("#top-textantly-btn").removeClass("hidden");
				$("#top-edit-btn").addClass("hidden");
				$("#main-form").addClass("inactive");
				$("#edit-form").removeClass("inactive");
				$("#displayer").hide();
				$("#editer").show();
				$("#img-container > img").detach().appendTo("#edit-img-container").attr("style", '');
				initEdit();
				activateCrop();
			});
			var changeToTextantlyHelper = function() {
				jcrop_api.destroy();
				$("#top-textantly-btn").addClass("hidden");
				$("#top-edit-btn").removeClass("hidden");
				$("#edit-form").addClass("inactive");
				$("#main-form").removeClass("inactive");
				$("#editer").hide();
				$("#displayer").show();
				$("#edit-img-container > img").detach().appendTo("#img-container").attr("style", '');
				updateAll();
			}
			$('.textantly-btn').on('click', function(){
				//$(".snackbar").each(function(){ $(this).snackbar("hide"); });
				savePendingEdits(changeToTextantlyHelper);
			});

			// Textantly
			$('#update-overlay').on('click', function(){ updateOverlay(); });
			$('#i-font').on('change', function(){ changeFont(); });
			$('#i-weight').on('change', function(){ changeFont(); });
			$('#i-align').on('change', function(){ textAlign(); });
			$('#i-position').on('change', function(){ changePosition(); });
			$('#i-width').on('change', function(){ changeTextWidth(); });
			$('#i-scheme').on('change', function(){ changeScheme(); });
			$('#i-image-url').on('change', function(){ changeImageUrl(); });
			$('#i-text').on('change', function(){ changeText(); });

				// File upload or url btns
			$("#url-form .btn-url-file").on('click', function(){
				$("#url-form").hide();
				$("#file-form").show();
			});
			$("#file-form .btn-url-file").on('click', function(){
				$("#file-form").hide();
				$("#url-form").show();
			});

				// Update & Download
			// $("#update-btn").on('click', function(){ updateAll(); });
			$('#download-btn').on('click', function(){
				// Download image on click
				textantlyToCanvas(true, false);
			});
		});

			// Edit & Crop
		$(window).on("load", function() {
			$(cropTg).on('click', function(){
				if($(this).hasClass("inactive")) { activateCrop(); }
			});
			$(allButCropTg).on('click', function(){
				if($(this).hasClass("inactive")) { activateAllButCrop(); }
			});
		});

		$(window).on("load", function() {
				// Restores
			$('#restore-resize').on('click', function(){ restoreResize(); });
			$('#restore-transform').on('click', function(){ restoreTransform(); });
				// Swap
			$('#horizontal-swap').on('click', function() { checkPendingRotate(horizontalSwap); });
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
			rotateSlider.noUiSlider.on('change', function(){
				rotateChecks(this.get().split(".")[0]);
			});
		});

		// Initialization
		$(window).on("load", function() {
			// Initialize tooltips
				// css -> .tooltip.fade { transition: none }
			var tooltipTimeout,
				tooltimeTimeIn;
			$("[data-toggle='tooltip']").tooltip({
		        // delay: {show: 0, hide: 300}
		        // animation: true
		    }).hover(function(){
		    	$(".tooltip").hide();
				var tooltipEl = $("#" + $(this).attr("aria-describedby"));
				clearTimeout(tooltimeTimeIn);
				tooltimeTimeIn = setTimeout( function(){ tooltipEl.fadeIn(); }, 600);
				clearTimeout(tooltipTimeout);
				tooltipTimeout = setTimeout( function(){ tooltipEl.removeClass(".active-tooltip").fadeOut(); }, 2200);
			});
			// Init Material Design lib
			$.material.init()
			// Adapt font size
			resizeText();
			// SLide up all wells but crop in image edit
			activeInactiveWell(cropTg, allButCropTg);
		});
	</script>
	<!-- Material Design fonts -->
	<link href="//fonts.googleapis.com/css?family=Playfair+Display+SC" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700">
	<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css" />
	<!-- Bootstrap -->
	<link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

	<!-- Bootstrap Material Design -->
	<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/9.0.0/nouislider.min.css" /> -->
    <link href=snackbarjs-11/snackbar.min.css rel=stylesheet>
	<link rel="stylesheet" href="bootstrap-material-design-0510/bootstrap-material-design.min.css" />
	<link rel="stylesheet" type="text/css" href="bootstrap-material-design-0510/ripples.min.css">
	<link rel="stylesheet" type="text/css" href="http://jcrop-cdn.tapmodo.com/v0.9.12/css/jquery.Jcrop.min.css">
	<style>
		body { margin: 0; padding: 0 15px 48px; }
		.container.main { padding: 30px 0 40px; text-align: left; }
		.form-group label.control-label { margin: 0; }
		.form-horizontal .form-group { margin: 0; }
		.form-group { margin: 0; }
		.form-group .help-block { position: static; display: block; margin: 0 0 5px; }
		.btn, .input-group-btn .btn { margin: 2px 1px 0; }
		.well.bs-component, body .container .well { padding-bottom: 16px; }
		#banner.page-header { margin-top: 0; padding: 0; }
		#banner.page-header h1 { font-size: 6rem; margin-top: 0; }
		#banner.page-header h1 .btn { vertical-align: -8px; }
		#main-form.inactive, #edit-form.inactive { display: none; }
		/* .togglebutton { padding: 5px 0 0 0; }
		.togglebutton label { margin: 0; } */
		.sm-btn-input > *:first-child { width: calc(100% - 67px); display: inline-block; vertical-align: top; }
		.sm-btn-input > *:nth-child(2) { /*width: 40px;*/ display: inline-block; vertical-align: top; margin-left: 22px; }
		.r-btn-input { margin: 7px 0; }
		.r-btn-input > *:first-child { width: 55px; display: inline-block; vertical-align: top; margin-right: 8px; margin: 4px 8px 0 4px; }
		.r-btn-input > *:nth-child(2) { width: calc(100% - 75px); display: inline-block; vertical-align: top; }
		.btn .fa { margin: 0 6px 0 0; }
		#url-form { display: none; }
		/* #loading-btn { display: none; }
		body.loading #update-btn { display: none; }
		body.loading #loading-btn { display: inline-block; } */
		.loading-img { font-size: 4rem; display: none; position: absolute; z-index: 4; text-align: center; top: 0; left: 0; right: 0; }
		body.loading { overflow: hidden; }
		body.loading .loading-img { display: block; }
		body.loading #displayer, body.loading #editer { position: relative; }
		body.loading #displayer:before, body.loading #editer:before { content: ''; display: block; position: absolute; z-index: 2; top: 0; right: -15px; bottom: 0; left: -15px; background: #EEE; }
		body.loading .jcrop-holder { display: none; }
		.snackbar { background: #fff; color: #333; max-width: 600px; min-width: 180px; }
		.snackbar.snackbar-opened { padding: 14px 20px; }
		.snackbar-content p { display: inline-block; margin: 0; }
		.snackbar-content .btn { margin: 8px 0 8px 10px; }
		#displayer, #editer { text-align: center; }
		#displayer > .container, #editer > .container { padding: 0; }
		#img-container { display: inline-block; font-size: 0; position: relative; }
		#img-container > img, #edit-img-container > img { max-width: 100%; }
		#img-container.nomax > img { max-width: none; }
		#img-container.max-recommended-px > img { max-width: <?php echo $max_recommended_size_px; ?>px; /* max-height: <?php echo $max_recommended_size_px; ?>px; */ }
		canvas { max-width: 100%; }
		#text-container { position: absolute;
    		box-sizing: border-box;
			background: rgba(255,255,255,0.3);
			display:flex;
			flex-direction: column;
			justify-content: center;
		}
		#text-container.off-overlay { visibility: hidden; }
		#text-container.light { background: rgba(255,255,255,0.3); }
		#text-container.dark { background: rgba(0,0,0,0.7); }
		#text-container.left, #text-container.right {
			width: 40%; padding: 8% 3%;
			top: 0; bottom: 0;
		}
		#text-container.top, #text-container.bottom {
			height: 25%; padding: 4% 6%;
			left: 0; right: 0;
		}
		#text-container.left {
			left: 0;
		}
		#text-container.right {
			right: 0;
		}
		#text-container.top {
			top: 0;
		}
		#text-container.bottom {
			bottom: 0;
		}
		#text-container > div {
			position: relative;
			display: inline-block;
			max-height: 100%;
			text-align: center;
		}
		#text-container.horizontal-bars > div:after, #text-container > div > div:after {
    		box-sizing: content-box;
		    content: '';
		    position: absolute;
		    left: 0;
		    right: 0;
		    width: 30%;
		    margin: 0 auto;
		    opacity: 0.7;
		}
		#text-container.horizontal-bars > div:after {
		    top: -14%;
		    border-bottom: 1px solid #150f05;
		    height: 2px;
		    border-top: 2px solid #150f05;
		}
		#text-container.horizontal-bars > div > div:after {
		    bottom: -14%;
		    border-top: 1px solid #150f05;
		    height: 2px;
		    border-bottom: 2px solid #150f05;
		}
		#text-container.horizontal-bars.light > div:after, #text-container.horizontal-bars.light > div > div:after { border-color: #150f05; }
		#text-container.horizontal-bars.dark > div:after, #text-container.horizontal-bars.dark > div > div:after { border-color: #f2f2f2; }
		#text-container > div > div { display: inline-block; }
		#text-container p {
    		margin: -0.125em 0 0;
			font-family: "Playfair Display SC";
			color: #150f05;
			text-align: center;
    		font-size: 100px;
    		line-height: 0.9;
		}
		#text-container.light p { color: #150f05; }
		#text-container.dark p { color: #f2f2f2; }
		#edit-form .well.inactive { cursor: pointer; }
		#edit-form .well.inactive legend { margin: 4px 0; transition: all 0.5s; }
		#edit-form .well .slide-down-btn { display: none; }
		#edit-form .well.inactive .control-restore-btn { display: none; }
		#edit-form .well.inactive .slide-down-btn { display: inline-block; }
		.btn-group-margin > *, .btn-group-margin > .btn, .btn-group-margin > .btn.btn-fab { margin-left: 6px; }
		.btn-group-margin > *:first-child, .btn-group-margin > .btn:first-child, .btn-group-margin > .btn.btn-fab:first-child { margin-left: 0; }
		#editer { display: none; }
		#editer > .container { position: relative; }
		#edit-img-container { margin: auto; display: inline-block; }
		#edit-img-container .jcrop-holder { background: transparent!important; }
		#edit-img-container img.h-swapped { transform: rotateY(180deg); }
		#edit-img-container img.pending-rotate { position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto;}
		#edit-img-container.nomax-i > img { max-width: none!important; }
		#edit-img-container.saving-rotate { position: relative; }
		#well-crop .btn-group { margin: 0 1px; }
		.btn-group-sm .btn-fab-fa, .btn-fab-mini-fa { padding: 9px 0px; }
		.btn-group-sm .btn-fab-fa .fa, .btn-fab-mini-fa .fa { font-size: 24px; margin: 0; }
		.tooltip.fade { transition: none; }
	</style>
</head>
<body>
	<div class="container main">
		<div class="page-header" id="banner">
		    <div class="row">
		        <div class="col-xs-12">
		        	<fieldset class="pull-right hidden-xs">
		        	<a href="javascript:void(0)" class="btn btn-default btn-fab edit-btn" id="top-edit-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Crop & Resize"><i class="material-icons">edit</i></a>
		        	<a href="javascript:void(0)" class="btn btn-default btn-fab textantly-btn hidden" id="top-textantly-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Back to Text"><i class="material-icons">text_fields</i></a>
		        	</fieldset>
		        	<h1><a href="javascript:void(0)" class="btn btn-primary btn-fab"><i class="material-icons">grade</i></a> Textantly</h1>
		        	<p class="lead">Delicious morning coffee. A keystroke away.</p>
		        </div>
		    </div>
		</div>
		<div class="row">
		    <div class="col-md-12">

				<div class="well bs-component" id="main-form">
					<div class="form-horizontal">
					  <fieldset>
						<div class="row">
							<div class="col-md-6">

					            <div class="form-group">
								    <label for="i-text" class="control-label">Text</label>
								    <input type="text" class="form-control" id="i-text" placeholder="Your Text Here" value="Your Text Here">
							    </div>

							    <div class="form-group">
								    <label for="i-font" class="control-label">Font family</label>
								    <input type="text" class="form-control" id="i-font" value="Playfair Display SC" placeholder="Playfair Display SC">
								    <span class="help-block">Any <a href="https://fonts.google.com/" target="_blank">Google Font</a> is valid.</span>
							    </div>

							    <div class="form-group">
								    <label for="i-weight" class="control-label">Text Weight</label>
								    <select class="form-control" id="i-weight">
									  <option value="300">Light</option>
									  <option value="400" selected>Normal</option>
									  <option value="700">Bold</option>
									</select>
							    </div>

							    <div class="form-group">
								    <label for="i-align" class="control-label">Text Alignment</label>
								    <select class="form-control" id="i-align">
									  <option value="left">Left</option>
									  <option value="center" selected>Center</option>
									  <option value="right">Right</option>
									</select>
							    </div>

						    </div>

							<div class="col-md-6">
					            <div class="form-group" id="url-form">
								    <label for="i-image-url" class="control-label">Image</label>
								    <div class="sm-btn-input">
								    	<input type="text" class="form-control" id="i-image-url" placeholder="http://...">
								    	<a href="javascript:void(0)" class="btn btn-default btn-fab btn-fab-mini btn-url-file" data-toggle="tooltip" data-placement="left" title="" data-original-title="Get Image from File"><i class="material-icons">folder_open</i></a>
								    </div>
							    </div>

							    <div id="file-form">
									<label for="i-image-local" class="control-label">Image</label>
								    <div class="sm-btn-input">
								    	<div class="form-group">
								    		<input type="text" readonly="" class="form-control" placeholder="Click to select file...">
        									<input type="file" id="i-image-local" multiple="">
								    	</div>
								    	<a href="javascript:void(0)" class="btn btn-default btn-fab btn-fab-mini btn-url-file" data-toggle="tooltip" data-placement="left" title="" data-original-title="Get Image from URL"><i class="material-icons">http</i></a>
								    </div>
							    </div>

							    <div class="form-group">
								    <label for="i-position" class="control-label">Overlay Position</label>
								    <select class="form-control" id="i-position">
									  <option value="left" selected>Left</option>
									  <option value="right">Right</option>
									  <option value="top">Top</option>
									  <option value="bottom">Bottom</option>
									</select>
							    </div>

							    <div class="form-group">
								    <label for="i-width" class="control-label">Overlay Width</label>
								    <input type="text" class="form-control" id="i-width" value="40%" placeholder="40%">
								    <span class="help-block">Percentages, px, and rem units are valid.</span>
							    </div>

					            <div class="form-group">
								    <label for="i-scheme" class="control-label">Color Scheme</label>
								    <select class="form-control" id="i-scheme">
									  <option value="light" selected>Light</option>
									  <option value="dark">Dark</option>
									</select>
							    </div>

						    </div>

					    	<div class="col-md-6">

						  		<div class="bs-component btn-group-sm btn-group-margin">
									<a href="javascript:void(0)" class="btn btn-fab btn-primary edit-btn" data-toggle="tooltip" data-placement="right" title="" data-original-title="Crop & Resize"><i class="material-icons">edit</i></a>
									<a href="javascript: overlayOnOff();" class="btn btn-fab btn-default" id="overlay-on-off" data-toggle="tooltip" data-placement="right" title="" data-original-title="Activate / Deactivate Text"><i class="material-icons">text_fields</i></a>
								</div>
					        </div>
					        <div class="col-md-6 text-right">
					            <a class="btn btn-flat" href="javascript: updateAll();">Update</a>
					            <a class="btn btn-flat btn-raised btn-primary" id="download-btn" href="javascript:void(0)">Download</a>
					        </div>
					  </div>

					  </fieldset>
					</div>
				</div>

				<div id="edit-form" class="inactive">
					<div class="row">

					    <div class="col-md-12">
					    	<div class="well bs-component" id="well-crop">
					    		<div class="form-horizontal">
								  	<div class="row">
								  		<div class="col-xs-3 col-sm-6">
								  			<legend>Crop</legend>
										</div>
								  		<div class="col-xs-9 col-sm-6 bs-component btn-group-sm btn-group-margin text-right">
      										<a href="javascript:resetCropSelector(1280,720)" class="btn btn-fab btn-fab-mini-fa btn-fab-fa control-restore-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Set to Youtube Optimal Dimensions"><i class="fa fa-youtube"></i></a>
      										<a href="javascript:resetCropSelector(1200,630)" class="btn btn-fab btn-fab-mini-fa btn-fab-fa control-restore-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Set to Facebook Optimal Dimensions"><i class="fa fa-facebook"></i></a>
      										<a href="javascript:resetCropSelector(1,1)" class="btn  btn-fab btn-fab-mini-fa control-restore-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Set to Square Dimensions"><i class="material-icons">crop_square</i></a>
      										<a href="javascript:resetCropSelector(0,0)" class="btn  btn-fab btn-fab-mini-fa control-restore-btn" data-toggle="tooltip" data-placement="left" title="" data-original-title="Set to Free Dimensions"><i class="material-icons">crop_free</i></a>
								  			<a href="javascript:void(0)" class="btn btn-default btn-fab slide-down-btn"><i class="material-icons">keyboard_arrow_down</i></a>
										</div>
									</div>
									<fieldset>
										<div class="form-group">
										    <div class="btn-group btn-group-justified btn-group-raised">
									            <a href="javascript:void(0)" class="btn ">Width</a>
									            <a href="javascript:void(0)" class="btn ">Height</a>
									        </div>
										    <div class="btn-group btn-group-justified">
									            <a href="javascript:void(0)" class="btn" id="crop-width">0</a>
									            <a href="javascript:void(0)" class="btn" id="crop-height">0</a>
									        </div>
									    </div>
					    			</fieldset>
					    		</div>
					    	</div>
					    </div>
						<div class="col-md-6">
							<div class="well bs-component">
								<div class="form-horizontal">
								  	<div class="row">
								  		<div class="col-xs-6">
								  			<legend>Resize</legend>
										</div>
								  		<div class="col-xs-6 bs-component btn-group-sm text-right">
									  		<a href="javascript:void(0)" class="btn btn-default btn-fab slide-down-btn "><i class="material-icons">keyboard_arrow_down</i></a>
								  			<a href="javascript:void(0)" class="btn btn-default btn-fab control-restore-btn" id="restore-resize" data-toggle="tooltip" data-placement="left" title="" data-original-title="Reset to Current Base Values"><i class="material-icons">settings_backup_restore</i></a>
										</div>
									</div>
									<fieldset>
										<div class="row">
											<div class="col-xs-6">
												<div class="form-group">
												    <label for="e-width" class="control-label">Width</label>
												    <input type="text" class="form-control" id="e-width">
											    </div>
											</div>
											<div class="col-xs-6">
									            <div class="form-group">
												    <label for="e-height" class="control-label">Height</label>
												    <input type="text" class="form-control" id="e-height">
											    </div>
											</div>
										</div>
								    </fieldset>
								</div>
							</div>
					    </div>
						<div class="col-md-6">
							<div class="well bs-component" id="well-transform">
								<div class="form-horizontal">
								  	<div class="row">
								  		<div class="col-xs-6">
								  			<legend>Transform</legend>
										</div>
								  		<div class="col-xs-6 bs-component btn-group-sm text-right">
								  			<a href="javascript:void(0)" class="btn btn-default btn-fab slide-down-btn "><i class="material-icons">keyboard_arrow_down</i></a>
								  			<a href="javascript:void(0)" class="btn btn-default btn-fab control-restore-btn" id="restore-transform" data-toggle="tooltip" data-placement="left" title="" data-original-title="Reset to Current Base Values"><i class="material-icons">settings_backup_restore</i></a>
										</div>
									</div>
									<fieldset>
										<div class="r-btn-input">
											<span class="input-group-btn input-group-sm">
							                    <button type="button" class="btn btn-fab btn-fab-mini" id="horizontal-swap" data-toggle="tooltip" data-placement="right" title="" data-original-title="Horizontal Swap">
							                    	<i class="material-icons">swap_horiz</i>
							                    </button>
							                </span>
								            <div class="form-group">
											    <label for="i-text" class="control-label">Rotate</label>
										    	<div class="slider svert" id="e-rotate-slider"></div>
										    </div>
									    </div>
								    </fieldset>
								</div>
							</div>
					    </div>
					    <div class="col-xs-12">
					    	<a href="javascript:void(0)" class="btn btn-primary btn-lg btn-block btn-raised textantly-btn">Done</a>
					    </div>
				  	</div>
				</div>


		    </div>
		</div>
	</div>
	<div id="displayer">
		<div class="loading-img"><i class="fa fa-circle-o-notch fa-spin"></i></div>
		<div class="container">
			<div id="img-container">
				<img src="default.png">
				<div id="text-container" class="left horizontal-bars"><div><div><p>Your Text Here</p></div></div>
				</div>
			</div>
		</div>
	</div>
	<div id="editer">
		<div class="loading-img"><i class="fa fa-circle-o-notch fa-spin"></i></div>
		<div class="container">
			<div id="edit-img-container">

			</div>
		</div>
	</div>
	<div class="hide" id="undo-img">
	</div>


</body>
</html>
