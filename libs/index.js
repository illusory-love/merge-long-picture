"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _glob = _interopRequireDefault(require("glob"));

var _canvas = _interopRequireDefault(require("canvas"));

function _default(opts) {
  var globPath = "./images/*.{jp?(e)g,gif,png}";

  var files = _glob.default.sync(globPath);

  console.log('files:', files);
}