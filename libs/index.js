#! /usr/bin/env node
"use strict";

var program = require('commander');

var _require = require('../package.json'),
    version = _require.version;

program.allowUnknownOption().version(version);
program.command('dir <directory>').description('图片文件夹').action(require('./dir'));
program.command('img <images>').description('图片名称组；以 "," 分隔；图片至少为 2 张').action(require('./images'));
program.parse(process.argv);