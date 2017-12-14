var PIL = {
  // Something?
};


(function(pil) { 'use strict';

    /**
     * Generates the markup and draw the miniature for the sepcified 
     * element. (Does not load the full image).
     * root_el is either a .progressive-bg-image or a .progressiveMedia
     */
    pil.initImage = function(root_el) {

        var miniatureImg = root_el.querySelector(".progressiveMedia-thumbnail");
        var canvas = root_el.querySelector(".progressiveMedia-canvas");
        var placeholderFilDiv = root_el.previousElementSibling;
        var width = root_el.dataset.width;
        var height = root_el.dataset.height;
        drawMinatureForImage(miniatureImg, canvas, placeholderFilDiv, width, height);

    };

    pil.initBgImage = function(root_el) {
        generateProgressiveBgImgMarkup(root_el);
        var miniatureImg = root_el.querySelector(".thumbnail");
        var canvas = root_el.querySelector(".progressive-img-load-canvas");
        drawMiniatureForBgImage(root_el, miniatureImg, canvas);
    }

    pil.initImages = function(root_els) {
        for (var i = 0; i < root_els.length; i++) {
            this.initImage(root_els[i]);
        }
    };

    pil.initBgImages = function(root_els) {
        for (var i = 0; i < root_els.length; i++) {
            this.initBgImage(root_els[i]);
        }
    };

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
     * If the element isn't marked with the data-scroll-loaded 
     * attribute set to true, start loading the full image and 
     * show it when finished.
     * root_el is either a .progressive-bg-image or a .progressiveMedia
     */
    pil.loadImage = function(root_el, callback) {
        var fullBgImg = root_el.querySelector(".progressiveMedia-image"),
        canvas = root_el.querySelector(".progressiveMedia-canvas");
        var _this = this;
        loadFullImage(fullBgImg, canvas, function(isSuccess) {
            _this.fullImageLoaded({"root_el": root_el, "canvas": canvas});
            typeof callback === 'function' && callback(isSuccess);
        });
    };

    pil.loadBgImage = function(root_el, callback) {
        var fullBgImg = root_el.querySelector(".full-bg-image"),
        canvas = root_el.querySelector(".progressive-img-load-canvas");
        var _this = this;
        loadFullBgImage(root_el, fullBgImg, canvas, function(isSuccess) {
            _this.fullImageLoaded({"root_el": root_el, "canvas": canvas});
            typeof callback === 'function' && callback(isSuccess);
        });
        
    };

    pil.loadImages = function(root_els) {
        for (var i = 0; i < root_els.length; i++) {
            this.loadImage(root_els[i]);
        }
    };

    pil.loadBgImages = function(root_els) {
        for (var i = 0; i < root_els.length; i++) {
            this.loadBgImage(root_els[i]);
        }
    };

    pil.loadAllImages = function() {
        var progressiveBgImages = document.getElementsByClassName("progressive-bg-image");
        this.loadBgImages(progressiveBgImages);
        
        var progressiveImages = document.getElementsByClassName("progressiveMedia");
        this.loadImages(progressiveImages);
    };

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
            } else if  (_hasClass(allImages[currentImageIdx], "progressiveMedia")) {
                _this.loadImage(allImages[currentImageIdx], function() {
                    currentImageIdx += 1;
                    loadNextImage();
                });
            }

        }
        loadNextImage();
    }

    /// Callback called when a .progressive-bg-image or 
    /// a .progressiveMedia was loaded.
    pil.fullImageLoaded = function(el) {};


    // 
    pil.initScrollLoadedImages = function() {
        var scrollLoadedElements = document.getElementsByClassName("scroll-loaded");


        

        document.onscroll = loadNewlyAppearedImages;
        document.onresize = loadNewlyAppearedImages;
        // 1) Load all .scroll-loaded elements in a list
        // 2) attach scroll & resize event to loadNewlyAppearedImages
        // 3) 
        function loadNewlyAppearedImages() {

            var scrollLoadedElements = document.getElementsByClassName("scroll-loaded");

            var window_height = window.innerHeight;
            var window_top_position = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var window_bottom_position = (window_top_position + window_height);
            for (var i = 0; i < scrollLoadedElements.length; i++) {
                var element_height = scrollLoadedElements[i].offsetHeight;
                var element_top_position = scrollLoadedElements[i].getBoundingClientRect().top + document.body.scrollTop;
                var element_bottom_position = (element_top_position + element_height);
                if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
                    if (_hasClass(scrollLoadedElements[i], "progressive-bg-image")) {
                        PIL.loadBgImage(scrollLoadedElements[i])
                    } else if (_hasClass(scrollLoadedElements[i], "progressiveMedia")) {
                        PIL.loadImage(scrollLoadedElements[i])
                    }
                    _removeClass(scrollLoadedElements[i], "scroll-loaded");
                }
            }
        }
        document.onscroll();
    }
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
 * fullImg: the .progressiveMedia-image element. It has to have the data-src attribute defined
 * canvas: the canvas showing the miniature
 *
 */
function loadFullImage(fullImg, canvas, callback) {
    fullImg.onload = function() {
        fullImg.classList.remove("hidden");
        canvas.style.opacity = 0;
        typeof callback === 'function' && callback(true);
    }
    fullImg.onerror = function() {
        typeof callback === 'function' && callback(false);
    } 
    fullImg.src = fullImg.dataset.src;
}

/**
 * drawMiniatureForBgImage(miniatureImg, canvas [, blur])
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
 * root_el: the .progressive-bg-image block element
 * fullBgImage: the .progressive-bg-image img
 * canvas: the canvas showing the miniature
 */
function loadFullBgImage(root_el, fullBgImg, canvas, callback) {
    function fullBackgroundImageLoaded() {
        root_el.style.backgroundImage = 'url(' + fullBgImg.src + ')';
        setTimeout(function(){ // Without timeout the canvas fade out before the background was set...
            canvas.style.opacity = 0;
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
 * root_el must be either a .progressive-bg-image 
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
        thumbnailImg.classList.add("hidden");
        thumbnailImg.classList.add("thumbnail");
        thumbnailImg.src = miniaturePath;
        c.appendChild(thumbnailImg);
        var fullBgImg = document.createElement("img");
        fullBgImg.classList.add("hidden");
        fullBgImg.classList.add("full-bg-image");
        fullBgImg.setAttribute("data-src", fullImagePath);
        c.appendChild(fullBgImg);
        var canvas = document.createElement("canvas");
        canvas.classList.add("full-absolute");
        canvas.classList.add("progressive-img-load-canvas");
        c.appendChild(canvas);
        root_el.prepend(c);

        // little hack to make the css transition wotk with the dynamically created canvas
        window.getComputedStyle(canvas).opacity; 
    }
}

/**
 * Tells if the specified element is has to be generated to a progressiveBackrgoundImage
 */
function isProgressiveBgImage(el) {
    return (root_el.dataset.hasOwnProperty("fullImagePath") 
        && root_el.dataset.hasOwnProperty("miniaturePath"));
}

function isProgressiveImage(el) {
    return (root_el.dataset.hasOwnProperty("fullImagePath") 
        && root_el.dataset.hasOwnProperty("miniaturePath")
        && root_el.dataset.hasOwnProperty("fullImageWidth")
        && root_el.dataset.hasOwnProperty("fullImageHeight"));
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
 * Return the generated .progressiveMedia
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
        rootDiv.className = root_el.className
        _addClass(rootDiv, "aspectRatioPlaceholder")

        var aspectRatioPlaceholderFill = document.createElement("div");
        aspectRatioPlaceholderFill.classList.add("aspectRatioPlaceholder-fill");
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

        c.appendChild(rootDiv)

        root_el.parentNode.insertBefore(c, root_el.nextSibling);
        root_el.remove()

        return progressiveMedia;
    }
}




function getCanvasForBgImage(root_el) {

}






/**
 * CanvasImage(canvasEl, image [, w, h [, xOffset, yOffset]])
 * canvasEl: the canvas to draw the image on
 * image: the image to draw
 * w: the width to give to the image on the canvas
 * h: the heightto give to the image on the canvas
 * xOffset: number in [0 : 1]
 * yOffset: number in [0 : 1]
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
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
function _hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    else
        return (new RegExp('(^| )' + className + '( |$)', 'gi')).test(el.className);
}
