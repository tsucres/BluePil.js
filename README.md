
PIL is a javascript library to progressively load images that works both for `img` tags **and** background-images.

\>>>>>>>> DEMO <<<<<<<<

(**Warning for mobile users**: the demo contains large images, think about it if you're on mobile data :) )

# Usage

There a 2 basic use cases: 
1. background image
2. `img` tag

## Background image

In this case, the aim is to progressively load the background image of a block element: 

```
<div class="bg-image">
<h1>Hi there</h1>
</div>
```

```css
.bg-image {
	background-image
}
```


This will automatically work with any `background-position`.


However, currently, only the `background-size: cover` is supported.


## img tag

Here, we want to turn 

```html

<img src="im.jpg">
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




# TODO

Make a vanila js version: currenty the swcript requires bootstrap & jQuery to work. 