'use strict';

const Validator = require('better-validator');
const serv = {};

serv.parseValidation = (errors) => {
  let stderr = [];
  for(let error of errors) {
    let msg = 'At ' + error.path[0];
    for(let i = 1; i < error.path.length; i++) {
      msg += ', ' + error.path[i];
    }
    msg += ' failed rule "' + (error.failed || error.test) + '" with value: ' + error.value;
    stderr.push(msg);
  }
  return stderr;
};

serv.entrySource = (source) => {
  let validator = new Validator();
  validator(source).display('source').required().isObject();
  return serv.parseValidation(validator.run());
};

module.exports = serv;