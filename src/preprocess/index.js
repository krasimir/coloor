var glob = require('glob');
var path = require('path');
var fs = require('fs');
var ColorThief = require('color-thief-jimp');
var Jimp = require("jimp");

var cache = {};
var srcRegExp = /src=[\"'](.+?)[\"']/;
var options = {
  sizeW: 3
};

var collectAllImages = function (dirs, callback) {
  var allFiles = [], p;

  dirs = dirs.slice();
  (function process () {
    if (dirs.length === 0) {
      return callback(allFiles);
    } else {
      p = dirs.shift() + '/*.*';
      glob(p, {}, function (err, files) {
        if (err) throw err;
        allFiles = allFiles.concat(files);
        process();
      });
    }
  })();
}

var collectAllHTMLTags = function (html, callback) {
  var re = /<(img|IMG)([\w\W]+?)\/?>/g, matches = [];

  while(match = re.exec(html)) {
    matches.push(match[0]);
  }
  return matches;
}

var imageProcessing = function (file, callback) {
  if (cache[file]) return callback(cache[file]);
  try {
    Jimp.read(file, function (err, image) {
      console.log('Image processing of ' + path.basename(file));
      var data = cache[file] = {
        width: image.bitmap.width,
        height: image.bitmap.height
      }
      data.ratio = data.width / data.height;
      image
        .resize(options.sizeW, options.sizeW / data.ratio)
        // .resize(data.width, data.height)
        .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
          if (err) return callback();
          data.colors = ColorThief.getColor(image) + '/' + ColorThief.getPalette(image, 5).join(' ');
          data.base64 = 'data:image/gif;base64,' + buffer.toString('base64');
          callback(data);
        })
    });
  } catch(err) {
    // console.log(err);
    callback();
  }
}

var getFileName = function (p) {
  return path.basename(p);
}

var typeOfQuotes = function (src, defaultType) {
  var m = src[0].match(/src=('|")/);

  return m ? m[1] : defaultType;
}

var merge = function (html, files, tags, callback) {
  (function process() {
    var tag, replaceWith, src, srcFile, file, quote = '"';

    if (tags.length === 0) { return callback(html); }

    tag = tags.shift();
    src = srcRegExp.exec(tag);

    if (src && src.length > 0) {
      srcFile = getFileName(src[1]);
      file = files.reduce(function (found, f) {
        if (found) return found;
        if (getFileName(f) === srcFile) return f;
        return false;
      }, false);
      if (file) {
        quote = typeOfQuotes(src, quote);
        imageProcessing(file, function (data) {
          if (!data) { return process(); }
          replaceWith = tag
            .replace(src[1], data.base64)
            .replace(
              /<(img|IMG)/, 
              '<img data-coloor=' + quote + src[1] + quote + ' ' +
              'data-coloor-size=' + quote + data.width + 'x' + data.height + quote + ' '
            );
          html = html.replace(tag, replaceWith);
          process();
        });
      } else {
        process();
      }
    } else {
      process();
    }
  })();
}


var Coloor = function (html, imgDirs, callback, ops) {
  if (ops) {
    options.sizeW = ops.size || options.sizeW;
  }
  if (!Array.isArray(imgDirs)) imgDirs = [imgDirs];
  collectAllImages(imgDirs, function (files) {
    merge(html, files, collectAllHTMLTags(html), callback);
  });
};

module.exports = Coloor;

module.exports.fromFile = function (file, imgDirs, callback, ops) {
  fs.readFile(file, function (err, data) {
    if (err) throw err;
    Coloor(data.toString('utf8'), imgDirs, callback, ops);
  });
}

// source: https://github.com/daniellmb/HEX-RGB-Conversion
function toHEX(red, blue, green) {
  return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);
}