'use strict';

const compAndRun = require('../../services/comp_and_run');
const conf = require('../../config');
const array = require('../../lib/array');
const util = require('../../services/utils');
const handler = {};

handler.run = (req, res) => {
  let buildPath = conf.buildPath + req.api.programName;
  let sourcePath = conf.sourcePath + req.file.filename;
  compAndRun.run(buildPath, array.clearString(req.body.stdin).join(' '))
  .then(result => {
    req.api.tracking.push('Ejecución del binario terminada.');
    let status = (result) ? (200) : (201);
    res.status(status).finish({
      success: result.success,
      stdout: { out: result.stdout },
      stderr: (result.stderr !== '') ? ([result.stderr]) : ([])
    });
    util.rmBuildAndSource(sourcePath, buildPath);
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
    util.rmBuildAndSource(sourcePath, buildPath);
  });
};

module.exports = handler;