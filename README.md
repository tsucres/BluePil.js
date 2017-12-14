
PIL is a javascript library to progressively load images that works both for `img` tags **and** `background-images`.

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



## Custom dist

I don't know about you but I'm tired of all the existing libraries that . So I built different version: 

- bgOnly
- ImgOnly
- Both
- bgOnly+scroll
- ImgOnly+scroll
- Both+scroll


# Build



# TODO

# LICENCE
