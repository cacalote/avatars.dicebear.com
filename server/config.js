"use strict";
exports.__esModule = true;
var path = require("path");
exports["default"] = {
    port: process.env.PORT || 3000,
    public: path.resolve(__dirname, '..', 'public'),
    cacheControl: 'public, max-age=' + (60 * 60 * 24 * 30)
};
