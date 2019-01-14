'use strict';

const handler = {};
const validator = require('../../lib/validators');
const bcrypt = /*require('bcrypt')*/ {};
const mysql = require('../../lib/mysql');
const util = require('../../lib/utils');

handler.signup = (req, res) => {
  let valid = validator.signupData(req.body);
  req.api.tracking.push('Datos de usuario validados.');
  if(valid.length) {
    return res.status(201).finish({
      success: false,
      stderr: valid
    });
  }

  util.sign(req.body.password)
  .then(hash => {
    req.body.password = hash;
    mysql.signupUser(req.body)
    .then(registered => {
      if(!registered.success) {
        req.api.tracking.push('Usuario NO registrador.');
        return res.status(201).finish({
          success: false,
          stderr: [registered.message]
        });
      }

      req.api.tracking.push('Usuario registrador,');
      req.body.password = undefined;
      return res.status(200).finish({
        success: true,
        stdout: req.body
      });
    });
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
  });
};

handler.signin = (req, res, next) => {
  let valid = validator.signinData(req.body);
  if(valid.length) {
    req.api.tracking.push('Entrada inválida');
    return res.status(201).finish({
      success: false,
      stderr: valid
    });
  }

  mysql.getUserData(req.body.username)
  .then(user => {
    if(!user) {
      req.api.tracking.push('Usuario inexistente.');
      return req.status(201).finish({
        success: false,
        stderr: ['User missing.']
      });
    }
    util.verify(req.body.password, user.password)
    .then(comp => {
      if(comp) {
        let token = util.generateJWT(user.id);
        req.api.tracking.push('Token generado.');
        return res.status(200).finish({
          success: true,
          stdout: { token: token }
        });
      }
      res.status(201).finish({
        success: false,
        stderr: ['Make sure that your credentias are correct.']
      });
    })
    .catch(error => {
      req.api.tracking.push(error.message);
      return res.status(500).finish({
        success: false,
        stderr: ['An unexpected error has ocurred.']
      });
    });
  });
};

handler.getUserData = (req, res) => {
  mysql.getUserById(req.api.user.id)
  .then(user => {
    return res.status(200).finish({
      success: true,
      stdout: user.data[0]
    });
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    return res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
  });
};

module.exports = handler;