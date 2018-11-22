'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
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

module.exports = util;