'use strict';

const flows = {};
const conf = require('../../config');
const midd = require('../../lib/middlewares');
const handlers = require('./handlers');
const source = require('multer')({ dest: conf.sourcePath });

flows.run = [
  midd.appAuth,
  source.single('source'),
  midd.sourceFormat,
  midd.build,
  handlers.run
];

module.exports = flows;