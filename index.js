"use strict";
exports.__esModule = true;
var express = require("express");
var canvas_1 = require("canvas");
var blob_to_buffer_1 = require("blob-to-buffer");
var avatars_1 = require("@dicebear/avatars");
var male_1 = require("@dicebear/avatars/lib/spriteSets/male");
var female_1 = require("@dicebear/avatars/lib/spriteSets/female");
var app = express();
var spriteSets = {
    male: male_1["default"],
    female: female_1["default"]
};
app.get('/:seed/:spriteSet/:size/', function (req, res, next) {
    if (parseInt(req.param('size')) < 20) {
        res.status(400).send('Minimum size of 20px.');
        next();
        return;
    }
    if (parseInt(req.param('size')) > 200) {
        res.status(400).send('Minimum size of 200px.');
        next();
        return;
    }
    if (!spriteSets[req.param('spriteSet')]) {
        res.status(400).send('Invalid sprite set. Available: ' + Object.keys(spriteSets).join(', '));
        next();
        return;
    }
    if (!req.param('seed')) {
        res.status(400).send('Invalid seed');
        next();
        return;
    }
    var avatars = new avatars_1["default"](spriteSets[req.param('spriteSet')], {
        size: parseInt(req.param('size'))
    });
    avatars.create(req.param('seed'), function (err, image) {
        if (err) {
            next(err);
            return;
        }
        image.addEventListener('load', function () {
            var canvasElement = new canvas_1["default"]();
            canvasElement.width = image.width;
            canvasElement.height = image.height;
            canvasElement.getContext('2d').drawImage(image, 0, 0);
            canvasElement.toBlob(function (blob) {
                blob_to_buffer_1["default"](blob, function (err, buffer) {
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': buffer.length
                    });
                    res.end(buffer);
                });
            }, 'image/png');
        });
        image.addEventListener('error', function (err) {
            next(err.error);
        });
    });
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
