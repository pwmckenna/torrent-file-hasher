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


var url = 'http://www.clearbits.net/get/24-go-open---eps-1-to-6.torrent';
var request = http.request(url);

request.addListener('response', function (response) {
    response.setEncoding('binary');
    var body = '';

    response.addListener('data', function (chunk) {
        body += chunk;
    });

    response.addListener('end', function() {
        var content = new Buffer(body, 'binary');
        var decoded = bencode.decode(content);
        console.log(JSON.stringify(decoded, null, 4));
    });
});

request.end();