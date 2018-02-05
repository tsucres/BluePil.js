
(function(pil) { 'use strict';
	
	/**
     * Generates the markup (if necessary) and draw the miniature for the specified 
     * element. (Does not load the full image).
     * root_el is the .progressiveMedia element.
     */
    pil.initImage = function(root_el) {

        var miniatureImg = root_el.querySelector(".progressiveMedia-thumbnail");
        var canvas = root_el.querySelector(".progressiveMedia-canvas");
        var placeholderFilDiv = root_el.previousElementSibling;
        var width = root_el.dataset.width;
        var height = root_el.dataset.height;
        drawMinatureForImage(miniatureImg, canvas, placeholderFilDiv, width, height);

    };


	/**
     * calls initImage() on the specified elements
     * root_els is an array of .progressiveMedia elements.
     */
    pil.initImages = function(root_els) {
        for (var i = 0; i < root_els.length; i++) {
            try {
                this.initImage(root_els[i]);
            } catch(err) {
                // @ifdef DEBUG 
                console.error(err); // So that if one image in the document fails to load, bluepill still tries the other ones.
                console.log("BluePil error: the following element failed to init: ");
                console.log(root_els[i]);
                // @endif
            }
        }
    };


	/**
     * Start loading the full image of the specified .progressiveMedia element and 
     * show it when finished.
     */
    pil.loadImage = function(root_el, callback) {
        var fullBgImg = root_el.querySelector(".progressiveMedia-image"),
        canvas = root_el.querySelector(".progressiveMedia-canvas");
        var _this = this;
        loadFullImage(root_el, fullBgImg, canvas, function(isSuccess) {
            _this.fullImageLoaded({"root_el": root_el, "canvas": canvas});
            typeof callback === 'function' && callback(isSuccess);
        });
    };


	/**
     * calls loadImage() on the specified elements
     * root_els is an array of .progressiveMedia elements.
     */
    pil.loadImages = function(root_els) {
        for (var i = 0; i < root_els.length; i++) {
            try {
                this.loadImage(root_els[i]);
            } catch(err) {
                // @ifdef DEBUG 
                console.error(err); // So that if one image in the document fails to load, bluepill still tries the other ones.
                console.log("BluePil error: the following element failed to load: ");
                console.log(root_els[i]);
                // @endif
            }
        }
    };
})(PIL);

/**
 * drawMinatureForImage(miniatureImg, canvas, placeholderFilDiv, width, height [, blur])
 * miniatureImg: the img element containing loading the miniature image
 * canvas: the canvas to draw the minature on
 * placeholderFilDiv: the .aspectRatioPlaceholder-fill
 * width: the width of the image
 * height: the height of the image
 * blur: the level of blur to add to the canvas: default is 2
 * 
 * Note: the dimension fot the image are exclusively used to keep the aspect ratio.
 */
function drawMinatureForImage(miniatureImg, canvas, placeholderFilDiv, width, height, blur) {
    var fill = height / width * 100;
    placeholderFilDiv.setAttribute('style', 'padding-bottom:'+fill+'%;');

    var smImageWidth = miniatureImg.width,
    smImageheight = miniatureImg.height;

    canvas.height = smImageheight;
    canvas.width = smImageWidth;

    blur = (typeof blur === 'number') ? blur : 2;
    
    var img = new Image();
    img.onload = function () {
        var canvasImage = new CanvasImage(canvas, img);
        canvasImage.blur(blur);
    };
    img.src = miniatureImg.src;
}

/**
 * loadFullImage(root_el, fullImg, canvas[, callback])
 * root_el: the .progressiveMedia element
 * fullImg: the .progressiveMedia-image element. It has to have the data-src attribute defined
 * canvas: the canvas showing the miniature
 * callback: called when the image is loaded with a boolean parameter indicating if the 
 *          image succesfully loaded or not.
 */
function loadFullImage(root_el, fullImg, canvas, callback) {
    fullImg.onload = function() {
        _removeClass(fullImg, "hidden");
        _addClass(root_el, "full-loaded");
        typeof callback === 'function' && callback(true);
    }
    fullImg.onerror = function() {
        typeof callback === 'function' && callback(false);
    } 
    fullImg.src = fullImg.dataset.src;
}
/**
 * Generates the markup for the specified element.
 * root_el must be a .progressiveMedia with the following 
 * data- attributes specified: 
 *  - data-full-image-path
 *  - data-miniature-path
 *  - data-full-image-width
 *  - data-full-image-height
 *  [- data-scroll-loaded]
 * Return the generated .progressiveMedia (or undifined if 
 *      the previous conditionnisn't verified)
 */
function generateProgressiveImgMarkup(root_el) {
    if (root_el.dataset.hasOwnProperty("fullImagePath") 
        && root_el.dataset.hasOwnProperty("miniaturePath")
        && root_el.dataset.hasOwnProperty("fullImageWidth")
        && root_el.dataset.hasOwnProperty("fullImageHeight")) {

        var fullImagePath = root_el.dataset["fullImagePath"];
        var miniaturePath = root_el.dataset["miniaturePath"];
        var fullImageWidth = root_el.dataset["fullImageWidth"];
        var fullImageHeight = root_el.dataset["fullImageHeight"];
        
        var c = document.createDocumentFragment();
        
        var rootDiv = document.createElement("div");
        rootDiv.className = root_el.className;
        _addClass(rootDiv, "aspectRatioPlaceholder");

        var aspectRatioPlaceholderFill = document.createElement("div");
        _addClass(aspectRatioPlaceholderFill, "aspectRatioPlaceholder-fill");
        rootDiv.appendChild(aspectRatioPlaceholderFill);

        var progressiveMedia = document.createElement("div");
        _addClass(progressiveMedia, "progressiveMedia");
        _addClass(progressiveMedia, "full-absolute");
        progressiveMedia.setAttribute("data-width", fullImageWidth);
        progressiveMedia.setAttribute("data-height", fullImageHeight);
        if (root_el.dataset.hasOwnProperty("scrollLoaded")) {
            _addClass(progressiveMedia, "scroll-loaded");
        }
        rootDiv.appendChild(progressiveMedia);

        var thumbnailImg = document.createElement("img");
        _addClass(thumbnailImg, "progressiveMedia-thumbnail");
        _addClass(thumbnailImg, "hidden");
        thumbnailImg.src = miniaturePath;
        progressiveMedia.appendChild(thumbnailImg);

        var fullImg = document.createElement("img");
        _addClass(fullImg, "progressiveMedia-image");
        _addClass(fullImg, "hidden");
        _addClass(fullImg, "full-absolute");
        fullImg.setAttribute("data-src", fullImagePath);
        fullImg.alt = root_el.alt;
        progressiveMedia.appendChild(fullImg);

        var canvas = document.createElement("canvas");
        _addClass(canvas, "progressiveMedia-canvas");
        _addClass(canvas, "full-absolute");
        progressiveMedia.appendChild(canvas);

        c.appendChild(rootDiv);

        root_el.parentNode.insertBefore(c, root_el.nextSibling);
        root_el.remove();

        return progressiveMedia;
    }
}