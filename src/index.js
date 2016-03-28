var glob = require('glob');
var palette = require('image-palette');
var path = require('path');
var fs = require('fs');

var dominantColorsCache = {};

var collectAllImages = function (dirs, callback) {
  var allFiles = [], p;
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
var getDominantColors = function (file, callback) {
  if (dominantColorsCache[file]) {
    return callback(dominantColorsCache[file]);
  }
  try {
    palette(file, function (colors) {
      callback(dominantColorsCache[file] = colors.map(function (color) { 
        return toHEX.apply(null, color); 
      }).join(','));
    });
  } catch(err) {
    callback();
  }
}
var getFileName = function (p) {
  return path.basename(p);
}
var merge = function (html, files, tags, callback) {
  (function process() {
    var tag, replaceWith, src, file;

    if (tags.length === 0) { return callback(html); }

    tag = tags.shift();
    src = /src=[\"'](.+?)[\"']/.exec(tag);

    if (src && src.length > 0) {
      src = getFileName(src[1]);
      file = files.reduce(function (found, f) {
        if (found) return found;
        if (getFileName(f) === src) return f;
        return false;
      });
      if (file) {
        getDominantColors(file, function (colors) {
          replaceWith = tag.replace(/<(img|IMG)/, '<img data-coloor="' + colors + '"');
          html = html.replace(tag, replaceWith);
          process();
        });
      } else {
        process();
      }
    } else {
      process();
    }
    

    // process();
  })();
}


var Coloor = function (html, imgDirs, callback) {
  if (!Array.isArray(imgDirs)) imgDirs = [imgDirs];
  collectAllImages(imgDirs, function (files) {
    merge(html, files, collectAllHTMLTags(html), callback);
  });
};

module.exports = Coloor;

module.exports.fromFile = function (file, imgDirs, callback) {
  fs.readFile(file, function (err, data) {
    if (err) throw err;
    Coloor(data.toString('utf8'), imgDirs, callback);
  });
}

// source: https://github.com/daniellmb/HEX-RGB-Conversion
function toHEX(red, blue, green) {
  return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);
}