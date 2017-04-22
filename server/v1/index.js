"use strict";
exports.__esModule = true;
var express = require("express");
var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var avatars_1 = require("@dicebear/avatars");
var male_1 = require("@dicebear/avatars/lib/spriteSets/male");
var female_1 = require("@dicebear/avatars/lib/spriteSets/female");
var config_1 = require("../config");
var spriteSets = {
    male: new avatars_1["default"](male_1["default"]),
    female: new avatars_1["default"](female_1["default"])
};
var router = express.Router();
router.get('/v1/:spriteSet/:seed/:size.png', function (req, res, next) {
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
    spriteSets[req.params.spriteSet].create(req.params.seed, { size: parseInt(req.params.size) }, function (err, canvas) {
        if (err) {
            next(err);
            return;
        }
        var buffer = canvas.toBuffer(undefined, 9);
        res.status(200);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', config_1["default"].cacheControl);
        res.end(buffer);
        var filePath = path.resolve(config_1["default"].public, './' + req.path);
        mkdirp(path.dirname(filePath), function (err) {
            if (err) {
                console.log(err);
                return;
            }
            fs.writeFile(path.resolve(config_1["default"].public, './' + req.path), buffer, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    });
});
exports["default"] = router;
