'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const util = {};

util.rmBuildAndSource = (sourcePath, buildPath) => {
  //Si es Windows.
  fs.unlink(buildPath + '.exe', error =>{});
  //Si es GNU/Linux.
  fs.unlink(buildPath, error =>{});
  fs.unlink(sourcePath, error =>{});
};

util.generateJWT = (userId) => {
  let privateKey = fs.readFileSync('./cert/private.key', {encoding: 'utf8'});
  let payload = {
    id: userId,
    iat: moment().unix(),
    exp: moment().add('1', 'day').unix()
  };
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
};

util.decodeJWT = (token) => {
  let publicKey = fs.readFileSync('./cert/public.pem');
  return jwt.verify(token, publicKey, {algorithms: 'RS256'});
};

util.generateAppkey = (appname, email) => {
  let key = `${moment().unix()}/${appname}/${email}`;
  return crypto.createHash('sha256', { encoding:'utf8'} ).update(key).digest('hex');
};

//Genera una firma con RSA de el dato privisionado.
//Retorna la firma en latin1 (string).
util.sign = (data) => {
  return new Promise((resolve, reject) => {
    let sign = crypto.createSign('SHA256');
    let privateKey = fs.readFileSync('./cert/private.key', { encoding: 'utf8' });
    sign.write(data);
    sign.end();
    return resolve(sign.sign(privateKey, 'base64'));
  });
};

//Verifica si la firma conincide con el dato provisionado.
//Retorna un booleano idicando si coinciden.
util.verify = (data, signature) => {
  return new Promise((resolve, reject) => {
    let verify = crypto.createVerify('SHA256');
    let publicKey = fs.readFileSync('./cert/public.pem', { encoding: 'utf8' });
    verify.write(data);
    verify.end();
    return resolve(verify.verify(publicKey, signature, 'base64'));
  });
}

module.exports = util;