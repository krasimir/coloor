# Image preloading utility

*(Inspired by [Dominant Colors for Lazy-Loading Images](https://manu.ninja/dominant-colors-for-lazy-loading-images) from [Manuel Wieser](https://twitter.com/manuelwieser))*

**Coloor** is a HTML preprocessor that decorates your `<img>` tags with `data-coloor` attributes containing a small base64 encoded version of your image. We quickly load the small image as placeholder while the original one is loading.

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
<img data-coloor="../photos/img.jpg" data-coloor-size="640x480"  src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAAAklEQVR4AewaftIAAAAjSURBVAEaAOX/Ab24tf+42PMA09zsAAL6+fkACwH3AOPq8QDUQg74d7o9lAAAAABJRU5ErkJggg==" alt="image 1" />
```

