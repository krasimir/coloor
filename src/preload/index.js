var Coloor = function () {

  function preload (image) {
    var originalSrc = image.getAttribute('data-coloor'), previewImage, preloadImage, w, h, size;

    originalSrc = image.getAttribute('data-coloor');
    size = image.getAttribute('data-coloor-size').split('x');
    w = parseInt(size[0]);
    h = parseInt(size[1]);
    previewImage = new Image();
    preloadImage = new Image();

    previewImage.onload = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(previewImage, 0, 0, w, h);
      image.src = canvas.toDataURL("image/png");
    }
    previewImage.src = image.getAttribute('src');

    preloadImage.onload = function () {
      image.src = originalSrc;
    }
    preloadImage.src = originalSrc;
  }

  var images = document.querySelectorAll('img[data-coloor]');
  for(var i=0; i<images.length; i++) {
    preload(images[i]);
  }

};

Coloor();