var Coloor = require('../../src/');
var root = __dirname;
var fs = require('fs');

Coloor.fromFile(root + '/markup/page.html', root + '/photos', function (html) {
  fs.writeFileSync(root + '/markup/index.html', html);
});