[![Build Status](https://travis-ci.org/tsucres/bluepil.svg?branch=master)](https://travis-ci.org/tsucres/bluepil)

BluePil.js is a javascript library to progressively load images that works both for `img` tags **and** `background-images`.

\>>>>>>>> DEMO <<<<<<<<

(**Warning for mobile users**: the demo contains large images, think about it if you're on mobile data :) )


# Usage

There a 2 basic use cases: 
1. background image
2. `img` tag

## Instal

According to the features you need, choose your distributtion file.

At the end of your body:,

```html
<script src="js/pil.min.js"></script>
```


Also, add t-a link to the css in the head: 

```html

```



## Background image

To make the background image of an element load progressively, you just have to add the class `.progressive-bg-image` and specify the path to the background image and to the miniature.

It's also a good idea to add a `<noscript>` tag: 


```html
<div class="progressive-bg-image" data-full-image-path="img/background.jpg" data-mini-image-path="img/background_mini.jpg">
	<noscript><img class="full-absolute object-fit-cover" src="img/background.jpg"></noscript>
	
</div>
```

This will automatically work with any `background-position`.


However, currently, only the `background-size: cover` is supported.


## img tag

To make an `img` tag load progressively, you have to set 4 attributes: 

- `data-full-image-path`
- `data-miniature-path`
- `data-full-image-width`
- `data-full-image-height`


```html

<img >
```


## In either cases

```html

<script type="text/javascript">
PIL.loadAllImages()
</script>

```
## Callbacks

The `fullImageLoaded` method is called when the image is finally loaded with an object with the following attributes as parameter: 

- 


```js
PIL.fullImageLoaded = function(pilObject) {
	pilObject.root_el // either .progressive-bg-image or .progressiveMedia
	pilObject.canvas // the blured canvas showing the miniature image
}

```



## Triger the download as the user scrolls


## Markup

```html

<section id="hero" class="progressive-bg-image">
		<!-- Progressive load of bg img -->
        <noscript><img class="full-absolute" src="img/background.jpg"></noscript>
        <img class="hidden thumbnail" src="img/background_mini.jpg"> <!-- TODO: b64 -->
        <img class="full-bg-image hidden" src="img/background.jpg">
        <canvas class="full-absolute progressive-img-load-canvas"></canvas>
        <!-- ===== -->
</section>

```

## Doc

**Note**: the following methods are included in the full version. The img-only and bg-only versions contain only the methods concerning respectively the `.progressiveMedia` and `.progressive-bg-image` elements.



**PIL.initAllImages()**: generates the markup (if needed) of all the `.progressiveMedia` and `.progressive-bg-image` elements found in the document and draws their blured miniatures.

**PIL.loadAllImages()**: starts downloading the full-size image for all the `.progressiveMedia` and `.progressive-bg-image` elements found in the document and shows them instead of their miniatures.

**PIL.go()**: calls `initAllImages()` and then `loadAllImages()` (waits for the document to be ready before starting).



**PIL.loadAllNonScrollLoadedImages()**: Loads all the images (both background and non background images) found in the document that aren't marked with the class scroll-loaded. (Assumes that all those elements have been initialized beforehand).

**PIL.initScrollLoadedImages()**: Assures that the elements marked with the class `scroll-loaded` (or with the data- attribute `data-scroll-loaded`) are loaded as the user scrolls.

**PIL.loadImagesSequentially()**: Loads all the images (both `.progressiveMedia` and `.progressive-bg-image`) found in the document, one by one, starting from the top of the DOM. (i.e. each image will start loading when the previous one finished loading).



**PIL.initImage(root_el)**: generates the markup (if needed) of the specified `.progressiveMedia` element and draws the blured miniature.

**PIL.initBgImage(root_el)**: same as `initImage` but for `.progressive-bg-image` elements.
 
**PIL.initImages(root_els)**: calls `PIL.initImage` for all the the `.progressiveMedia` elements the specified list.

**PIL.initBgImages(root_els)**: same as `initImages` but for `.progressive-bg-image` elements.


**PIL.loadImage(root_el[, callback])**: starts downloading the full-size image for the specified `.progressiveMedia` element and shows it instead of the miniature. The callback is called when the image finished loading with a boolean indicating the success of the operation.

**PIL.loadBgImage(root_el[, callback])**: same as `loadImage` but for `.progressive-bg-image` elements.

**PIL.loadImages(root_els)**: calls `PIL.loadImage` for all the the `.progressiveMedia` elements in the specified list.

**PIL.loadBgImages(root_els)**: same as `loadImages` but for `.progressive-bg-image` elements.



**PIL.fullImageLoaded(el)**: serves as a callback called when a full-size image (bg or img) is successfully loaded. The `el` parameter is an object with 2 attributes: 
- `canvas`: the canvas that used to display the miniature
- `root_el`: the `.progressiveMedia` or `.progressive-bg-image` element that has been loaded.



## Custom dist

I don't know about you but I'm tired of all the existing libraries that . So I built different version: 

- bgOnly
- ImgOnly
- Both
- bgOnly+scroll
- ImgOnly+scroll
- Both+scroll


# Build

1. Clone the repo
2. Install gulp and its plugins: `npm install`
3. run gulp: 
	- `gulp` for the complete version
	- `gulp bgOnly` for the background-image only version
	- `gulp imgOnly` for the img only version

# TODO

# LICENCE

BluePil is under MIT Licence. (check the [LICENCE](LICENCE) file).