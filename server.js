'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const middlewares = require('./services/middlewares');
const devenvModule = require('./modules/devenv/routes');

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(middlewares.dataFormat);

//Modules.
server.use('/devenv', devenvModule);

module.exports = server;