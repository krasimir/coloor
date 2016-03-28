# Image preloading utility that uses dominant color

(Inspired by [Dominant Colors for Lazy-Loading Images](https://manu.ninja/dominant-colors-for-lazy-loading-images) from [Manuel Wieser](https://twitter.com/manuelwieser))

*Coloor* is a HTML preprocessor that decorates your `<img>` tags with `data-coloor` attribute containing the dominant colors (5) of your image.

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
<img src="photos/img.jpg" alt="description" />
```

Output:

```html
<img data-coloor="b9bcba,308c5e,1a1d1a,4d8d6c,1c713b" src="photos/img.jpg" alt="description" />
```