var Coloor = require('../src/preprocess/');
var root = __dirname;
var fs = require('fs');

Coloor.fromFile(root + '/markup/page.html', root + '/photos', function (html) {
  fs.writeFileSync(root + '/index.html', html);
}, { size: 3 });