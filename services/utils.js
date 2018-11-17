'use strict';

const fs = require('fs');
const util = {};

util.rmBuildAndSource = (sourcePath, buildPath) => {
  fs.unlink(buildPath + '.exe', error =>{});
  fs.unlink(sourcePath, error =>{});
};

module.exports = util;