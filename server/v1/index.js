"use strict";
exports.__esModule = true;
var express = require("express");
var Chance = require("chance");
var ms = require('ms');
var avatars_1 = require("@dicebear/avatars");
var male_1 = require("@dicebear/avatars/lib/spriteSets/male");
var female_1 = require("@dicebear/avatars/lib/spriteSets/female");
var config_1 = require("../config");
var spriteSets = {
    male: new avatars_1["default"](male_1["default"]),
    female: new avatars_1["default"](female_1["default"])
};
var router = express.Router();
router.get(/\/v1\/([^/]+)\/([^/]*)\/(\d+)\.png/, function (req, res, next) {
    var spriteSet = req.params[0];
    var seed = req.params[1];
    var size = req.params[2];
    if (parseInt(size) < config_1["default"].minSize) {
        res.status(400).send('Minimum size of ' + config_1["default"].minSize + 'px.');
        next();
        return;
    }
    if (parseInt(size) > config_1["default"].maxSize) {
        res.status(400).send('Maximum size of ' + config_1["default"].maxSize + 'px.');
        next();
        return;
    }
    if (!spriteSets[spriteSet]) {
        res.status(400).send('Invalid sprite set. Available: ' + Object.keys(spriteSets).join(', '));
        next();
        return;
    }
    var chance = new Chance(seed);
    spriteSets[spriteSet].create(chance, { size: parseInt(size) }, function (err, canvas) {
        if (err) {
            next(err);
            return;
        }
        var buffer = canvas.toBuffer(undefined, 9);
        res.status(200);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=' + (ms(config_1["default"].httpCaching) / 1000));
        res.end(buffer);
    });
});
exports["default"] = router;
