'use strict';

const conf = require('../config');
const compAndRun = require('../services/comp_and_run');
const validators = require('./validators');
const ProcessTracking = require('../lib/process_traking');
const EventEmitter = require('events');
const fs = require('fs');
const moment = require('moment');
const util = require('../services/utils');
const mysql = require('../services/mysql');
const midd = {};

//Agrega un seguidor de registros y un método de formateo de respuestas.
midd.dataFormat = (req, res, next) => {
  res.api = new EventEmitter();

  req.api = {};
  req.api.events = res.api;
  req.api.events.on('finished', () => {
    req.api.tracking.print();
  });

  req.api.endpoint = req._parsedUrl;
  req.api.tracking = new ProcessTracking({
    process: req.api.endpoint.path,
    method: req.method
  });

  res.finish = (r = {}) => {
    r = res.json({
      success: (r.success !== undefined && r.success !== null) ? (r.success) : (true),
      stderr: r.stderr || [],
      stdout: r.stdout || {}
    });
    res.api.emit('finished');
    return r;
  };

  return next();
};

midd.allowedOriginsOfTheApi = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  return next();
};

midd.allowedHeaders = function(req, res, next) {
  res.header("access-control-allow-headers", "x-clientapp, Authorization, content-type");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE");
  res.header("x-clientapp");
  return next();
}

//Le da la extención .cpp a los archivos fuente entrantes, además de validarlos.
//Si no pasa la validación, responde el error.
midd.sourceFormat = (req, res, next) => {
  //Valida si el archivo está.
  let valid = validators.entrySource(req.file);
  if(req.body.code) {
    req.api.tracking.push('Escribiendo archivo de código fuente.');
    let programName = moment().unix() + '.cpp';
    let file = fs.createWriteStream(conf.sourcePath + programName, { encoding: 'utf8' });
    file.write(req.body.code, error => {
      file.close();
      if(error) {
        req.api.tracking.push(error.message);
        return res.status(500).finish({
          success: false,
          stderr: ['An unexpected error has occurred.']
        });
      }
      req.file = {
        filename: programName
      };
      return next();
    });
  } else if(valid.length) {
    req.api.tracking.push('Archivo inválido');
    return res.status(201).finish({
      success: false,
      stderr: valid
    });
  } else {
    fs.rename(conf.sourcePath + req.file.filename, conf.sourcePath + req.file.filename + '.cpp', (error) => {
      if(error) {
        req.api.tracking.push(error.message);
        return res.status(500).finish({
          success: false,
          stderr: ['An unexpected error has occurred.']
        });
      }
  
      req.file.filename += '.cpp';
      return next();
    });
  }
};

//Hace que el archivo de código fuente que se reciba se compile y mande a la ruta por defecto
//de esos archivo. En caso de que no se pueda, responde con el error.
midd.compile = (req, res, next) => {
  //Hacer la compilación...
  compAndRun.compile(conf.sourcePath + req.file.filename, '../.' + conf.buildPath)
  .then(result => {
    if(!result.success) {
      fs.unlinkSync(conf.sourcePath + req.file.filename);
      let stderr = result.stderr.split('\n');
      req.api.tracking.push(stderr.shift());
      stderr = stderr.join('\n');
      return res.status(201).finish({
        success: false,
        stderr: [stderr]
      });
    }
    req.api.programName = result.programName;
    req.api.tracking.push('Compilación exitosa.');
    return next();
  })
  .catch(error => {
    fs.unlinkSync(conf.sourcePath + req.file.filename);
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has occurred.']
    });
  });
};

//Revisa el token de sesión del usuario. Si lo tiene y está vigente, continúa.
//En otro caso, retorna el error.
midd.userAuth = (req, res, next) => {
  let user;
  try {
    user = util.decodeJWT(req.headers.authorization);
  } catch(error) {
    req.api.tracking.push(error.message);
    return res.status(403).finish({
      success: false,
      stderr: ['Your token is invalid.']
    });
  }
  if(user.exp < moment().unix()) {
    req.api.tracking.push('Token expirado.');
    return res.status(403).finish({
      success: false,
      stderr: ['Your session has expired.']
    });
  }

  req.api.user = user;
  return next();
};

midd.appAuth = (req, res, next) => {//console.log(req.headers);
  let appkey = req.headers['x-clientapp'];
  if(!appkey) {
    req.api.tracking.push('Sin hash de autorización');
    return res.status(403).finish({
      success: false,
      stderr: ["Forbidden. That app don't have permited using this service."]
    });
  }
  mysql.getAppData(appkey)
  .then(clientapp => {
    if(!clientapp) {
      req.api.tracking.push('Hash de autorización no reconocido.');
      return res.status(403).finish({
        success: false,
        stderr: ["Forbidden. That app don't have permited using this service."]
      });
    }
    return next();
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has occurred.']
    });
  })
};

module.exports = midd;