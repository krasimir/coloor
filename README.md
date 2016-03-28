# Image preloading utility that uses dominant color

(Inspired by [Dominant Colors for Lazy-Loading Images](https://manu.ninja/dominant-colors-for-lazy-loading-images) from [Manuel Wieser](https://twitter.com/manuelwieser))

*Coloor* is a HTML preprocessor that decorates your `<img>` tags with `data-coloor` attribute containing the dominant color of your image.

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