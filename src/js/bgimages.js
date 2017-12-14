
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
            this.initBgImage(root_els[i]);
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
            this.loadBgImage(root_els[i]);
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