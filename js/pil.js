

PIL = {
        fullImageLoaded: function(object) {},
        loadAllImages: function() {
            var images = [];
            $('.progressive-bg-image').toArray().forEach(function(element){
                //generateMarkupIfNeeded(element);
               //console.log(element);
                images.push(new ProgressivelyLoadedBackground(element));
            });
            $('.progressiveMedia').toArray().forEach(function(element) {
                images.push(new ProgressivelyLoadedImage(element));
            });
            return images;
        },
        loadImage: function(root_el, startDownload) { // root_el is either .progressiveMedia or .progressive-bg-image
            if (root_el.classList.contains("progressiveMedia")) {
                return new ProgressivelyLoadedImage(root_el, startDownload);
            } else if (root_el.classList.contains("progressive-bg-image")) {
                return new ProgressivelyLoadedBackground(root_el, startDownload);
            }
        },
        loadImages: function(root_els, startDownload) {
            var images = [];
            root_els.forEach(function(root_el) {
                images.push(PIL.loadImage(root_el, startDownload));
            });
            return images;
        }, 
        
    }

ProgressivelyLoadedImage = function(root_el, startDownload) {
        var self = this;
        this.root_el = root_el
        this.startDownload = (typeof startDownload !== 'undefined') ?  startDownload : true;
        // calculate aspect ratio
        // for the aspectRatioPlaceholder-fill
        // that helps to set a fixed fill for loading images
        var width = this.root_el.dataset.width,
        height = this.root_el.dataset.height,
        fill = height / width * 100,
        placeholderFill = this.root_el.previousElementSibling;

        placeholderFill.setAttribute('style', 'padding-bottom:'+fill+'%;');


        // get thumbnail height wight
        // make canvas fun part
        this.thumbnail = this.root_el.querySelector('.progressiveMedia-thumbnail');
        var smImageWidth = this.thumbnail.width,
        smImageheight = this.thumbnail.height;

        this.canvas = this.root_el.querySelector('.progressiveMedia-canvas');
        var context = this.canvas.getContext('2d');

        this.canvas.height = smImageheight;
        this.canvas.width = smImageWidth;

        var img = new Image();
        img.src = this.thumbnail.src;

        img.onload = function () {
            // draw canvas
            var canvasImage = new CanvasImage(self.canvas, img);
            canvasImage.blur(2);
        };

        this.downloadFullImage = function() {
            // grab data-src from original image
            // from progressiveMedia-image
            self.lgImage = self.root_el.querySelector('.progressiveMedia-image');
            self.lgImage.src = self.lgImage.dataset.src;

            // onload image visible
            self.lgImage.onload = function() {
                self.lgImage.classList.remove("hidden");
                $(self.canvas).css({opacity: 0});
                delete self.lgImage;
                self.thumbnail.remove();
                delete self.thumbnail;
                delete self.startDownload;
                delete self.downloadFullImage;
                PIL.fullImageLoaded(self);
            }
        }

        if (this.startDownload) {
            this.downloadFullImage();
        }

        
    }

    ProgressivelyLoadedBackground = function(root_el, startDownload) {
        var self = this;
        this.root_el = root_el;
        this.startDownload = (typeof startDownload !== 'undefined') ?  startDownload : true;
        
        this.canvas = $(root_el).find(".progressive-img-load-canvas")[0];
        this.thumbnailImg = $(root_el).find(".thumbnail")[0];
        // 1) Draw the thumbnail in the canvas
        
        var thumbnail = new Image();
        thumbnail.onload = function () {
            // css("background-position") return a string "n% n%"
            offsets = []
            $(self.root_el).css("background-position").replace(/%/g, "").split(" ").forEach(function(offset) {
                offsets.push(parseInt(offset) / 100);
            });
            var canvasImage = new CanvasImage(self.canvas, thumbnail, $(self.canvas).width(), $(self.canvas).height(), offsets[0], offsets[1]);
            canvasImage.blur(2);
        };
        thumbnail.src = this.thumbnailImg.src;


        
        function fullBackgroundImageLoaded() {
            $(self.root_el).css('background-image', 'url(' + self.fullBackgroundImage.src + ')');
            $(self.canvas).css({opacity: 0});
            self.thumbnailImg.remove();
            self.fullBackgroundImage.remove();
            delete self.thumbnailImg;
            delete self.fullBackgroundImage;
            delete self.downloadFullImage;
            PIL.fullImageLoaded(self);
        }
        this.downloadFullImage = function() {
            // 2) Download & load the full size image
            self.fullBackgroundImage = $(root_el).find('.full-bg-image')[0];

            if (self.fullBackgroundImage.complete) {
                fullBackgroundImageLoaded();
            } else {
                self.fullBackgroundImage.addEventListener('load', fullBackgroundImageLoaded);
                self.fullBackgroundImage.addEventListener('error', function() {
                    // Keep the blured canvas?
                })
            }  


        }
        if (this.startDownload) {
            this.downloadFullImage();
        } 
         
    }
$(function(){
    

  	/*

    $('.progressive-bg-image').toArray().forEach(function(element){
        //generateMarkupIfNeeded(element);
       //console.log(element);
        new ProgressivelyLoadedBackground(element);
    });
    $('.progressiveMedia').toArray().forEach(function(element) {
        new ProgressivelyLoadedImage(element);
    });*/

    


    
});
function generateMarkupIfNeeded(element) {
        if (element.dataset.hasOwnProperty("fullImagePath") && element.dataset.hasOwnProperty("miniaturePath")) {
            // TODO: generate
            fullImagePath = element.dataset["fullImagePath"];
            miniaturePath = element.dataset["miniaturePath"];
            mark = '<img class="hidden thumbnail" src="' + miniaturePath + '">';
            mark += '<img class="full-bg-image hidden" src="' + fullImagePath + '">';
            mark += '<canvas class="full-absolute progressive-img-load-canvas"></canvas>';
            //element.innerHTML = mark + element.innerHTML;
            $(element).prepend($(mark));
        }
    }

/**
 * By Ken Fyrstenberg Nilsen
 *
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

// source: pilpil.js
CanvasImage = function (e, t, w, h, xOffset, yOffset) {
    this.image = t;
    this.element = e;
    e.width = typeof w === 'number' ? w : t.width;
    e.height = typeof h === 'number' ? h : t.height;
    //e.width = t.width;
    //e.height = t.height;
    xOffset = typeof xOffset === 'number' ? xOffset : 0.5;
    yOffset = typeof yOffset === 'number' ? yOffset : 0.5;
    this.context = e.getContext('2d');
    //this.context.drawImage(t, 0, 0);
    drawImageProp(this.context, t, 0, 0, e.width, e.height, xOffset, yOffset);
};

function getOffsetFromBgPosition(bgPosition) {
    /**
     * bgPosition: one of the supported background-position values like "center center", "left top", etc
     * return: {x:[numer 0-1], y:[number 0-1]}
     * default: {x: 0.5, y: 0.5} corresponding to "center center"
     */
    xPosition = ""; yPosition = "";
    splitedBgPosition = bgPosition.split(" ");
    if (splitedBgPosition.length == 2) {
        xPosition = splitedBgPosition[0];
        yPosition = splitedBgPosition[1];
    }
    xPositions = {"left": 0, "right": 1};
    yPositions = {"top": 0, "bottom": 1};
    xOffset = 0.5 // center by default
    yOffset = 0.5
    if (xPositions.hasOwnProperty(xPosition)) {
        xOffset = xPositions[xPosition];
    }
    if (yPositions.hasOwnProperty(yPosition)) {
        yOffset = yPositions[xPosition];
    }
    return {x: xOffset, y: yOffset};
    
}

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