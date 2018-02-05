/**
 * This file contains the functions needed in both versions (bgImg or Img)
 */

var PIL = {};

(function(pil) { 'use strict';

	/**
     * Inits all the images (both background and non background images) found in the document.
     */
    pil.initAllImages = function() {
        var progressiveBgImages = document.getElementsByClassName("progressive-bg-image");
        this.initBgImages(progressiveBgImages);

        var progressiveMedias = Array.prototype.slice.call(document.getElementsByClassName("progressiveMedia"));
        var progressiveImages = document.getElementsByClassName("progressive-image");
        
        for (var i = 0; i < progressiveImages.length; i++) {
            progressiveMedias.push(generateProgressiveImgMarkup(progressiveImages[i]));
        } 
        this.initImages(progressiveMedias);
    };
	

	/**
     * Loads all the images (both background and non background images) found in the document.
     */
    pil.loadAllImages = function() {
        var progressiveBgImages = document.getElementsByClassName("progressive-bg-image");
        this.loadBgImages(progressiveBgImages);
		
        var progressiveImages = document.getElementsByClassName("progressiveMedia");
        this.loadImages(progressiveImages);
    };
	
	/**
     * Loads all the images (both background and non background images) found in the 
     * document that aren't marked with the class scroll-loaded.
     */
    pil.loadAllNonScrollLoadedImages = function() {
        var progressiveBgImages = document.getElementsByClassName("progressive-bg-image");
        for (var i = 0; i < progressiveBgImages.length; i++) {
            if (!_hasClass(progressiveBgImages[i], "scroll-loaded")) {
                this.loadBgImage(progressiveBgImages[i]);
            }
        }

        var progressiveImages = document.getElementsByClassName("progressiveMedia");
        for (var i = 0; i < progressiveImages.length; i++) {
            if (!_hasClass(progressiveImages[i], "scroll-loaded")) {
                this.loadImage(progressiveImages[i]);
            }
        }
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
            if (_hasClass(allImages[currentImageIdx], "progressive-bg-image")) {
                _this.loadBgImage(allImages[currentImageIdx], function() {
                    currentImageIdx += 1;
                    loadNextImage();
                });
            }

            if  (_hasClass(allImages[currentImageIdx], "progressiveMedia")) {
                _this.loadImage(allImages[currentImageIdx], function() {
                    currentImageIdx += 1;
                    loadNextImage();
                });
            }
        }
        loadNextImage();
    }

	/// Add the event listener to the scroll-loaded images
    pil.initScrollLoadedImages = function() {
        
        function loadNewlyAppearedImages() {

            var scrollLoadedElements = document.getElementsByClassName("scroll-loaded");

            var window_height = window.innerHeight;
            var window_top_position = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var window_bottom_position = (window_top_position + window_height);
            for (var i = 0; i < scrollLoadedElements.length; i++) {
                var el_rect = scrollLoadedElements[i].getBoundingClientRect();
                var element_top_position = window_top_position + el_rect.top;
                var element_bottom_position = element_top_position + el_rect.height;
                if ((element_bottom_position > window_top_position) && (element_top_position < window_bottom_position)) {
                    if (_hasClass(scrollLoadedElements[i], "progressive-bg-image")) {
                        PIL.loadBgImage(scrollLoadedElements[i])
                    } 
                    if (_hasClass(scrollLoadedElements[i], "progressiveMedia")) {
                        PIL.loadImage(scrollLoadedElements[i])
                    }
                    _removeClass(scrollLoadedElements[i], "scroll-loaded");
                }
            }
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

(function(pil) { 'use strict';
    /**
     * Generates the markup (if necessary) and draw the miniature for the specified 
     * element. (Does not load the full image).
     * root_el is the .progressive-bg-image element.
     */
    pil.initBgImage = function(root_el) {
        generateProgressiveBgImgMarkup(root_el);
        var miniatureImg = root_el.querySelector(".thumbnail");
        var canvas = root_el.querySelector(".progressive-img-load-canvas");
        drawMiniatureForBgImage(root_el, miniatureImg, canvas);
    }
    /**
     * calls initBgImage() on the specified elements
     * root_els is an array of .progressive-bg-image elements.
     */
    pil.initBgImages = function(root_els) {
        for (var i = 0; i < root_els.length; i++) {
            try {
                this.initBgImage(root_els[i]);
            } catch(err) {
            }
        }
    };
    /**
     * Start loading the full image of the specified .progressive-bg-image element and 
     * show it when finished.
     */
    pil.loadBgImage = function(root_el, callback) {
        var fullBgImg = root_el.querySelector(".full-bg-image"),
        canvas = root_el.querySelector(".progressive-img-load-canvas");
        var _this = this;
        loadFullBgImage(root_el, fullBgImg, canvas, function(isSuccess) {
            _this.fullImageLoaded({"root_el": root_el, "canvas": canvas});
            typeof callback === 'function' && callback(isSuccess);
        });
        
    };
    /**
     * calls loadBgImage() on the specified elements
     * root_els is an array of .progressive-bg-image elements.
     */
    pil.loadBgImages = function(root_els) {
        for (var i = 0; i < root_els.length; i++) {
            try {
                this.loadBgImage(root_els[i]);
            } catch(err) {
            }
        }
    };

})(PIL);


/**
 * drawMiniatureForBgImage(root_el, miniatureImg, canvas [, blur])
 * root_el: the .progressive-bg-image element
 * miniatureImg: the img element containing loading the miniature image
 * canvas: the canvas to draw the minature on
 * blur: the level of blur to add to the canvas: default is 2
 * 
 * Note: the dimension fot the image are exclusively used to keep the aspect ratio.
 */
function drawMiniatureForBgImage(root_el, miniatureImg, canvas, blur) {
    blur = (typeof blur === 'number') ? blur : 2;
    var thumbnail = new Image();
    thumbnail.onload = function () {

        // css("background-position") return a string "n% n%"
        offsets = [];
        window.getComputedStyle(root_el, null).backgroundPosition.split(" ").forEach(function(offset) {
            offsets.push(parseInt(offset) / 100);
        });
        var canvasImage = new CanvasImage(canvas, thumbnail, canvas.offsetWidth, canvas.offsetHeight, offsets[0], offsets[1]);
        canvasImage.blur(blur);
    };
    thumbnail.src = miniatureImg.src;

}

/**
 * loadFullBgImage(root_el, fullBgImg, canvas[, callback])
 * root_el: the .progressive-bg-image block element
 * fullBgImage: the .progressive-bg-image img
 * canvas: the canvas showing the miniature
 * callback: called with a boolean parameter (True for success, False if the 
 *          image couldn't be loaded) when the image finieshed loading.
 */
function loadFullBgImage(root_el, fullBgImg, canvas, callback) {
    function fullBackgroundImageLoaded() {
        root_el.style.backgroundImage = 'url(' + fullBgImg.src + ')';
        setTimeout(function(){ // Without timeout the canvas fade out before the background was set...
            _addClass(root_el, "full-loaded");
            typeof callback === 'function' && callback(true);
        }, 10);
    } 
    if (fullBgImg.src && fullBgImg.complete) {
        fullBackgroundImageLoaded();
    } else {
        fullBgImg.addEventListener('load', fullBackgroundImageLoaded);
        fullBgImg.addEventListener('error', function() {
            typeof callback === 'function' && callback(false)
        });
        if (fullBgImg.hasAttribute("data-src")) {
            fullBgImg.src = fullBgImg.dataset.src;
        }
    }
    
    
}

/**
 * Generates the markup for the specified element.
 * root_el must be a .progressive-bg-image 
 * with the following data- attributes specified: 
 *  - data-full-image-path
 *  - data-miniature-path
 *  [- data-scroll-loaded]
 */
function generateProgressiveBgImgMarkup(root_el) {
    if (root_el.dataset.hasOwnProperty("fullImagePath") 
        && root_el.dataset.hasOwnProperty("miniaturePath")) {

        if (root_el.dataset.hasOwnProperty("scrollLoaded")) {
            _addClass(root_el, "scroll-loaded");
        }


        var fullImagePath = root_el.dataset["fullImagePath"];
        var miniaturePath = root_el.dataset["miniaturePath"];

        var c = document.createDocumentFragment();
        var thumbnailImg = document.createElement("img");
        _addClass(thumbnailImg, "hidden");
        _addClass(thumbnailImg, "thumbnail");
        thumbnailImg.src = miniaturePath;
        c.appendChild(thumbnailImg);
        var fullBgImg = document.createElement("img");
        _addClass(fullBgImg, "hidden");
        _addClass(fullBgImg, "full-bg-image");
        fullBgImg.setAttribute("data-src", fullImagePath);
        c.appendChild(fullBgImg);
        var canvas = document.createElement("canvas");
        _addClass(canvas, "full-absolute");
        _addClass(canvas, "progressive-img-load-canvas");
        c.appendChild(canvas);
        root_el.prepend(c);

        // little hack to make the css transition wotk with the dynamically created canvas
        window.getComputedStyle(canvas).opacity; 
    }
}

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