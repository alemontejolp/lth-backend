'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const util = {};

util.rmBuildAndSource = (sourcePath, buildPath) => {
  fs.unlink(buildPath + '.exe', error =>{});
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

module.exports = util;