'use strict';

const flows = {};
const conf = require('../../config');
const midd = require('../../services/middlewares');
const handlers = require('./handlers');
const source = require('multer')({ dest: conf.sourcePath });

flows.run = [
  source.single('source'),
  midd.sourceFormat,
  midd.compile,
  handlers.run
];

module.exports = flows;