var gett = require('../');

var key = '';     //fill
var email = '';   //fill
var password = '';//fill

gett.uploadFile(key, email, password,
    'test.txt', new Buffer('hello world'),
    function(err, fileMeta) {
        console.log('err      :', err);
        console.log('fileMeta :', fileMeta);
    }
);

