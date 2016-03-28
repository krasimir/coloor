var Coloor = require('../../src/');
var root = __dirname;

Coloor.fromFile(root + '/markup/page.html', root + '/photos', function (html) {
  console.log('-------------');
  console.log(html);
});