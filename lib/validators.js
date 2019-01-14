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

serv.signupData = (user) => {
  let validator = new Validator();
  validator(user).required().isObject(obj => {
    obj('username').required().isString();
    obj('email').required().isString();
    obj('firstname').required().isString();
    obj('lastname').required().isString();
    obj('password').required().isString();
  });

  return serv.parseValidation(validator.run());
};

serv.signinData = (user) => {
  let validator = new Validator();
  validator(user).required().isObject(obj => {
    obj('username').required().isString();
    obj('password').required().isString();
  });

  return serv.parseValidation(validator.run());
};

serv.creationCourseData = (course) => {
  let validator = new Validator();
  validator(course).required().isObject(obj => {
    obj('title').required().isString();
    obj('price').required().isNumber();
    obj('author').required().isNumber().integer();
  });

  return serv.parseValidation(validator.run());
};

serv.signupAdminData = (admin) => {
  let validator = new Validator();
  validator(admin).required().isObject(obj => {
    obj('email').required().isString();
    obj('password').required().isString();
  });

  return serv.parseValidation(validator.run());
};

serv.creationVideoData = (video) => {
  let validator = new Validator();
  validator(video).required().isObject(obj => {
    obj('course').required().isString();
    obj('title').required().isString();
    obj('video').required().isObject(o => {
      o('filename').required().isString();
    });
  });

  return serv.parseValidation(validator.run());
};

module.exports = serv;