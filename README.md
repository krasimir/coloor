# Coloor - Image preloading utility

*(Inspired by [Dominant Colors for Lazy-Loading Images](https://manu.ninja/dominant-colors-for-lazy-loading-images) from [Manuel Wieser](https://twitter.com/manuelwieser))*

**Coloor** is a HTML preprocessor that decorates your `<img>` tags with `data-coloor` attributes containing a small base64 encoded version of your image. The idea is to quickly show the small image as a placeholder while the original one is loading.

#### [Demo](http://krasimir.github.io/coloor/example/)

*(to simulate slow network connection use [Chrome's throttling](http://krasimirtsonev.com/blog/articles/coloor/demo.jpg))*

## Installation

`npm i coloor -S`

## Usage

```js
var Coloor = require('coloor');

Coloor(
  '<html string>',
  ['<img files dir>', '<img files dir>'],
  function (decoratedHTML) {
    // ...
  }
);
```

Input:

```html
<img src="../photos/img.jpg" alt="image 1" />
```

Output:

```html
<img 
  data-coloor="../photos/img.jpg"
  data-coloor-size="640x480" 
  src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAAAklEQVR4AewaftIAAAAjSURBVAEaAOX/Ab24tf+42PMA09zsAAL6+fkACwH3AOPq8QDUQg74d7o9lAAAAABJRU5ErkJggg=="
  alt="image 1" />
```

Then include [this code](https://github.com/krasimir/coloor/blob/master/lib/coloor.min.js) (776 bytes) on your page to get the preloading works:

```js
function Coloor(){var d=document;var ce="createElement";var ga="getAttribute";function isCanvasSupported(){var elem=d[ce]("canvas");return!!(elem.getContext&&elem.getContext("2d"))}function preload(image){var src,pi,li,w,h,size;if(!isCanvasSupported()){image.src=src;return}src=image[ga]("data-coloor");size=image[ga]("data-coloor-size").split("x");w=parseInt(size[0]);h=parseInt(size[1]);pi=new Image;li=new Image;pi.onload=function(){var canvas=d[ce]("canvas");var ctx=canvas.getContext("2d");canvas.width=w;canvas.height=h;ctx.drawImage(pi,0,0,w,h);image.src=canvas.toDataURL("image/png")};pi.src=image[ga]("src");li.onload=function(){image.src=src};li.src=src}var images=d.querySelectorAll("img[data-coloor]");for(var i=0;i<images.length;i++){preload(images[i])}}Coloor();
```

## Build systems

* Gulp plugin - [https://github.com/krasimir/gulp-coloor](https://github.com/krasimir/gulp-coloor)
* Webpack loader - [https://github.com/krasimir/coloor-loader](https://github.com/krasimir/coloor-loader)

## Notes

* Notice that the snippet that you have to embed in your page starts with `function Color()`. The same function is called at the end. In some cases you may not have the decorated HTML at the first render. For example, if you deal with React (jsx) application the HTML is rendered by JavaScript and appears in the DOM with some delay. In this case you have to call `Coloor()` manually.

