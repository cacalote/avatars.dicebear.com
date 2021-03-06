"use strict";
exports.__esModule = true;
var express = require("express");
var config_1 = require("./config");
var _1 = require("./v1/");
var app = express();
app.use(express.static(config_1["default"].public));
app.use('/dist/', express.static('./node_modules/@dicebear/avatars/dist/'));
app.use(_1["default"]);
app.listen(config_1["default"].port, function () {
    console.log('Example app listening on port ' + config_1["default"].port);
});
