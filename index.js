var request = require('request');
var async = require('async');
var gett = exports;

var BASE = 'https://open.ge.tt/1';

exports.auth = function(key, email, password, next) {
    request({
        method: 'POST',
        uri: BASE + '/users/login',
        json: {
            apikey: key,
            email: email,
            password: password
        }
    }, function(err, res, body) {
        if (err) {
            next(err);
            return;
        }

        if (body.error) {
            next(body.error);
            return;
        }

        next(null, body, body.accesstoken);
    });
};

exports.getAllShares = function(token, next) {
    request({
        method: 'GET',
        uri: BASE + '/shares',
        json: true,
        qs: {
            accesstoken: token
        }
    }, function(err, res, body) {
        if (err) {
            next(err);
            return;
        }

        if (body.error) {
            next(body.error);
            return;
        }

        next(null, body);
    });
};

exports.createShare = function(token, title, next) {
    request({
        method: 'POST',
        uri: BASE + '/shares/create',
        qs: {
            accesstoken: token
        },
        json: {
            title: title
        }
    }, function(err, res, body) {
        if (err) {
            next(err);
            return;
        }

        if (body.error) {
            next(body.error);
            return;
        }

        next(null, body);
    });
};

exports.createFile = function(token, shareName, fileName, next) {
    request({
        method: 'POST',
        uri: BASE + '/files/' + shareName + '/create',
        qs: {
            accesstoken: token
        },
        json: {
            filename: fileName
        }
    }, function(err, res, body) {
        if (err) {
            next(err);
            return;
        }

        if (body.error) {
            next(body.error);
            return;
        }

        next(null, body);
    });
};

exports._uploadBuffer = function(token, fileMeta, buffer, next) {
    var upload = fileMeta.upload;
    var uri = upload.puturl;

    request({
        method: 'PUT',
        uri: uri,
        qs: {
            accesstoken: token
        },
        body: buffer
    }, function(err, res, body) {
        if (err) {
            next(err);
            return;
        }
        next(null, body);
    });
};

exports._uploadStream = function(token, fileMeta, stream, next) {
    var upload = fileMeta.upload;
    var uri = upload.puturl;

    stream.pipe(request({
        method: 'PUT',
        uri: uri,
        qs: {
            accesstoken: token
        }
    }, function(err, res, body) {
        if (err) {
            next(err);
            return;
        }
        next(null, body);
    }));
};

//--------------------------------------------------------------------

exports.uploadFile = function (key, email, password, fileName, bufferOrStream, allDone) {
    var token;
    var resultFileMeta;

    async.waterfall([

        function(next) {
            gett.auth(key, email, password, next);
        },

        function(body, accesstoken, next) {
            token = accesstoken;
            gett.getAllShares(token, next);
        },

        function(shares, next) {

            if (!shares.length) {
                gett.createShare(token, 'default', next);
                return;
            }

            next(null, shares[0]);
        },

        function(share, next) {
            var sharename = share.sharename;
            gett.createFile(token, sharename, fileName, next);
        },

        function(fileMeta, next) {
            resultFileMeta = fileMeta;
            if(bufferOrStream instanceof Buffer) {
                gett._uploadBuffer(token, fileMeta, bufferOrStream, next);
            } else {
                gett._uploadStream(token, fileMeta, bufferOrStream, next);
            }
        }


    ], function(err) {
        if (err) {
            allDone(err);
            return;
        }
        allDone(null, resultFileMeta);
    });
};
