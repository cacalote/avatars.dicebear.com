"use strict";
exports.__esModule = true;
var express = require("express");
var avatars_1 = require("@dicebear/avatars");
var male_1 = require("@dicebear/avatars/lib/spriteSets/male");
var female_1 = require("@dicebear/avatars/lib/spriteSets/female");
var app = express();
var spriteSets = {
    male: new avatars_1["default"](male_1["default"]),
    female: new avatars_1["default"](female_1["default"])
};
app.get('/:seed/:spriteSet/:size/', function (req, res, next) {
    if (parseInt(req.params.size) < 20) {
        res.status(400).send('Minimum size of 20px.');
        next();
        return;
    }
    if (parseInt(req.params.size) > 200) {
        res.status(400).send('Maximum size of 200px.');
        next();
        return;
    }
    if (!spriteSets[req.params.spriteSet]) {
        res.status(400).send('Invalid sprite set. Available: ' + Object.keys(spriteSets).join(', '));
        next();
        return;
    }
    if (!req.params.seed) {
        res.status(400).send('Invalid seed');
        next();
        return;
    }
    spriteSets[req.params.spriteSet].create(req.params.seed, function (err, canvas) {
        if (err) {
            next(err);
            return;
        }
        var buffer = canvas.toBuffer();
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length
        });
        res.end(buffer);
    }, { size: parseInt(req.params.size) });
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
