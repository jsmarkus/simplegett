var gett = require('../');
var fs = require('fs');
var async = require('async');

var key = ''; //fill
var email = ''; //fill
var password = ''; //fill

async.series([
    function(next) {
        gett.uploadFile(key, email, password,
            'cat_purr.png',
            fs.createReadStream('images/cat_purr.png'),
            next
        );
    },
    function(next) {
        gett.uploadFile(key, email, password,
            'cat_slippers.png',
            fs.createReadStream('images/cat_slippers.png'),
            next
        );
    },
    function(next) {
        gett.uploadFile(key, email, password,
            'cat_tied.png',
            fs.createReadStream('images/cat_tied.png'),
            next
        );
    },
    function(next) {
        gett.uploadFile(key, email, password,
            'cat_walk.png',
            fs.createReadStream('images/cat_walk.png'),
            next
        );
    }
], function(err, fileMeta) {
    console.log('err      :', err);
    console.log('fileMeta :', fileMeta);
});