/**
 * This file contains the functions needed in both versions (bgImg or Img)
 */

var PIL = {};

(function(pil) { 'use strict';

	/**
     * Inits all the images (both background and non background images) found in the document.
     */
    pil.initAllImages = function() {
    	// @ifdef BP_BG_IMG 
        var progressiveBgImages = document.getElementsByClassName("progressive-bg-image");
        this.initBgImages(progressiveBgImages);
        // @endif

        // @ifdef BP_IMG 
        var progressiveMedias = Array.prototype.slice.call(document.getElementsByClassName("progressiveMedia"));
        var progressiveImages = document.getElementsByClassName("progressive-image");
        
        for (var i = 0; i < progressiveImages.length; i++) {
            progressiveMedias.push(generateProgressiveImgMarkup(progressiveImages[i]));
        } 
        this.initImages(progressiveMedias);
        // @endif
    };
	

	/**
     * Loads all the images (both background and non background images) found in the document.
     */
    pil.loadAllImages = function() {
    	// @ifdef BP_BG_IMG 
        var progressiveBgImages = document.getElementsByClassName("progressive-bg-image");
        this.loadBgImages(progressiveBgImages);
        // @endif
		
		// @ifdef BP_IMG 
        var progressiveImages = document.getElementsByClassName("progressiveMedia");
        this.loadImages(progressiveImages);
        // @endif
    };
	

	/**
     * Loads all the images (both background and non background images) found in the 
     * document that aren't marked with the class scroll-loaded.
     */
    pil.loadAllNonScrollLoadedImages = function() {
    	// @ifdef BP_BG_IMG 
        var progressiveBgImages = document.getElementsByClassName("progressive-bg-image");
        for (var i = 0; i < progressiveBgImages.length; i++) {
            if (!_hasClass(progressiveBgImages[i], "scroll-loaded")) {
                this.loadBgImage(progressiveBgImages[i]);
            }
        }
        // @endif

        // @ifdef BP_IMG 
        var progressiveImages = document.getElementsByClassName("progressiveMedia");
        for (var i = 0; i < progressiveImages.length; i++) {
            if (!_hasClass(progressiveImages[i], "scroll-loaded")) {
                this.loadImage(progressiveImages[i]);
            }
        }
        // @endif
    }
	

	/**
     * Loads all the images (both background and non background 
     * images) found in the document, one by one, starting from 
     * the top of the DOM. (i.e. each image will start loading when 
     * the previous one finished loading).
     */
    pil.loadImagesSequentially = function() {
        var allImages = document.querySelectorAll(".progressive-bg-image, .progressiveMedia");

        var currentImageIdx = 0;
        var _this = this;
        function loadNextImage() {
            if (currentImageIdx >= allImages.length) {
                return;
            }
            // @ifdef BP_BG_IMG 
            if (_hasClass(allImages[currentImageIdx], "progressive-bg-image")) {
                _this.loadBgImage(allImages[currentImageIdx], function() {
                    currentImageIdx += 1;
                    loadNextImage();
                });
            }
			// @endif

			// @ifdef BP_IMG 
            if  (_hasClass(allImages[currentImageIdx], "progressiveMedia")) {
                _this.loadImage(allImages[currentImageIdx], function() {
                    currentImageIdx += 1;
                    loadNextImage();
                });
            }
            // @endif
        }
        loadNextImage();
    }
	

	/// Add the event listener to the scroll-loaded images
    pil.initScrollLoadedImages = function() {
        var timer;

        function loadNewlyAppearedImages() {

            var scrollLoadedElements = document.getElementsByClassName("scroll-loaded");

            var window_height = window.innerHeight;
            var window_top_position = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var window_bottom_position = (window_top_position + window_height);
            for (var i = 0; i < scrollLoadedElements.length; i++) {
                var el_rect = scrollLoadedElements[i].getBoundingClientRect();
                var element_top_position = window_top_position + el_rect.top;
                var element_bottom_position = element_top_position + el_rect.height;
                if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
                    // @ifdef BP_BG_IMG 
                    if (_hasClass(scrollLoadedElements[i], "progressive-bg-image")) {
                        PIL.loadBgImage(scrollLoadedElements[i])
                    } 
					// @endif
					// @ifdef BP_IMG 
                    if (_hasClass(scrollLoadedElements[i], "progressiveMedia")) {
                        PIL.loadImage(scrollLoadedElements[i])
                    }
                    _removeClass(scrollLoadedElements[i], "scroll-loaded");
                	// @endif
                }
            }
        }
        function timelyLoadNewlyAppearedImages() {
        	timer = timer || setTimeout(function() {
		      	timer = null;
		      	loadNewlyAppearedImages();
		    }, 100);
        }
        document.addEventListener("scroll", loadNewlyAppearedImages);
        document.addEventListener("resize", loadNewlyAppearedImages);

        loadNewlyAppearedImages();
    }


	/**
     *  Callback called when a .progressive-bg-image or 
     * a .progressiveMedia was loaded.
     * el: {canvas: <CanvasElement>, root_el: .progressive-bg-image or .progressiveMedia element}
     */
    pil.fullImageLoaded = function(el) {};

    pil.go = function() { // TODO: sequence/scroll by param?
    	var _this = this;
    	function directlyLoadAllImages() {
    		_this.initAllImages();
			_this.loadAllImages();
    	}
    	if (document.readyState != "loading") {
    		directlyLoadAllImages();
    	} else {
    		;(function() {
    			directlyLoadAllImages();
    		})();
    	}
    };

})(PIL);


/**
 * CanvasImage(canvasEl, image [, w, h [, xOffset, yOffset]])
 * canvasEl: the canvas to draw the image on
 * image: the image to draw
 * w: the width to give to the image on the canvas
 * h: the heightto give to the image on the canvas
 * xOffset: number in [0 : 1], default: 0.5
 * yOffset: number in [0 : 1], default: 0.5
 */
CanvasImage = function (canvasEl, image, w, h, xOffset, yOffset) {
    this.image = image;
    this.element = canvasEl;
    canvasEl.width = typeof w === 'number' ? w : image.width;
    canvasEl.height = typeof h === 'number' ? h : image.height;
    
    xOffset = typeof xOffset === 'number' ? xOffset : 0.5;
    yOffset = typeof yOffset === 'number' ? yOffset : 0.5;
    this.context = canvasEl.getContext('2d');
    drawImageProp(this.context, image, 0, 0, canvasEl.width, canvasEl.height, xOffset, yOffset);
};

// source: pilpil.js
CanvasImage.prototype = {
    blur:function(e) {
        this.context.globalAlpha = 0.5;
        for(var t = -e; t <= e; t += 2) {
            for(var n = -e; n <= e; n += 2) {
                this.context.drawImage(this.element, n, t);
                var blob = n >= 0 && t >= 0 && this.context.drawImage(this.element, -(n -1), -(t-1));
            }
        }
    }
};



/**
 * By Ken Fyrstenberg Nilsen (https://stackoverflow.com/users/1693593/k3n)
 * source: https://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas/21961894
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
*/
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }
    /// default offset is center
    offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5;
    
    /// keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   /// new prop. width
        nh = ih * r,   /// new prop. height
        cx, cy, cw, ch, ar = 1;

    /// decide which gap to fill    
    if (nw < w) ar = w / nw;
    if (nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    /// calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    /// make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    /// fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}


function _addClass(el, className) {
    if (el.classList && el.classList.add) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}
function _removeClass(el, className) {
    if (el.classList && el.classList.remove)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
function _hasClass(el, className) {
    if (el.classList && el.classList.contains)
        return el.classList.contains(className);
    else
        return (new RegExp('(^| )' + className + '( |$)', 'gi')).test(el.className);
}