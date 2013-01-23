/*
 * benc2json
 * https://github.com/pwmckenna/benc2json
 *
 * Copyright (c) 2013 Patrick Williams
 * Licensed under the MIT license.
 */

var http = require('http');
var bencode = require('bencode');
var fs = require('fs');
var _ = require('lodash');
var URL = require('url');

var headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
};

var app = http.createServer(function(req, res) {
    var query = URL.parse(req.url, true).query;
    console.log(query);

    // if we don't have a url argument, then lets bail
    if(!query.hasOwnProperty('url')) {
        res.writeHead(400);
        res.end();
        return;
    }

    var url = query['url'];
    var request = http.request(url);

    request.addListener('response', function (requestResponse) {
        requestResponse.setEncoding('binary');
        var body = '';

        requestResponse.addListener('data', function (chunk) {
            body += chunk;
        });

        requestResponse.addListener('end', function() {
            var content = new Buffer(body, 'binary');
            var decoded = bencode.decode(content);
            var json = JSON.stringify(decoded, null, 4);

            if(query.hasOwnProperty('callback')) {
                var callback = query['callback'];
                body = callback + '(' + json + ')';
            } else {
                body = json;
            }

            res.writeHead(200, headers);
            res.end(body);
        });
    });

    request.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});

