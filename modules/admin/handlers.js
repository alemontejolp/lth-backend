'use strict';

const handler = {};
const mysql = require('../../services/mysql');
const validator = require('../../services/validators');
const util = require('../../services/utils');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const conf = require('../../config');
const fs = require('fs');
const moment = require('moment');

handler.signin = (req, res, next) => {
  let failed = validator.signupAdminData(req.body);
  if(failed.length) {
    req.api.tracking.push('Tipos de credenciales inválidos.');
    return res.status(201).finish({
      success: false,
      stderr: failed
    });
  }

  mysql.getAdminData(req.body.email)
  .then(admin => {
    if(!admin) {
      req.api.tracking.push('Admin inexistente.');
      return req.status(201).finish({
        success: false,
        stderr: ['Admin missing.']
      });
    }

    bcrypt.compare(req.body.password, admin.password)
    .then(same => {
      if(!same) {
        req.api.tracking.push('Credenciales inválidas.');
        return res.status(201).finish({
          success: false,
          stderr: ['Invalid credentials.']
        });
      }

      let token = util.generateJWT(admin.id);
      req.api.tracking.push('Admin conectado.');
      return res.status(200).finish({
        success: true,
        stdout: {
          token: token
        }
      });
    })
    .catch(error => {
      req.api.tracking.push(error.message);
      res.status(500).finish({
        success: false,
        stderr: ['An unexpected error has ocurred.']
      });
    });
  })
};

handler.createCourse = (req, res, next) => {
  req.body.author = req.api.user.id;
  let stderr = validator.creationCourseData(req.body);
  if(stderr.length) {
    req.api.tracking.push('Entrada inválida.');
    return res.status(201).finish({
      success: false,
      stderr: stderr
    });
  }

  req.body.alias = crypto.createHash('sha256').update(`${req.api.user.id}${moment().unix()}`).digest('hex');

  mysql.createCourse(req.body)
  .then(result => {
    req.api.tracking.push('Curso creado.');
    return res.status(200).finish({
      success: true,
      stdout: {
        alias: req.body.alias,
      }
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

handler.creationVideo = (req, res) => {
  req.body.video = req.file;
  let stderr = validator.creationVideoData(req.body);
  if(stderr.length) {
    req.api.tracking.push('Entrada inválida.');
    res.status(201).finish({
      success: false,
      stderr: stderr
    });
    return fs.unlinkSync(conf.videoPath + req.file.filename);
  }
  
  let extencion = req.file.originalname.split('.').pop();
  let path = `static/videos/${req.file.filename}.${extencion}`;
  fs.renameSync(`./static/videos/${req.file.filename}`, `./${path}`);
  req.body.url = `${conf.host}/${path}`;
  req.body.alias = crypto.createHash('sha256').update(`${req.api.user.id}${moment().unix()}`).digest('hex');

  mysql.createVideo(req.body)
  .then(result => { console.log(result);
    if(!result.success) {
      req.api.tracking.push(result.message);
      res.status(201).finish({
        success: false,
        stderr: [result.message]
      });
      return fs.unlinkSync(`./${path}`);
    }

    req.api.tracking.push('Video creado.');
    return res.status(200).finish({
      success: true,
      stdout: {
        url: req.body.url,
        alias: req.body.alias
      }
    });
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
    fs.unlinkSync(`./${path}`);
  });
};

module.exports = handler;