'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const middlewares = require('./services/middlewares');
const devenvModule = require('./modules/devenv/routes');
const userModule = require('./modules/users/routes');
const adminModule = require('./modules/admin/routes');
const coursesModule = require('./modules/courses/routes');

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(middlewares.allowedOriginsOfTheApi);
server.use(middlewares.allowedHeaders);
server.use(middlewares.dataFormat);

server.use('/static', express.static('static'));

//Modules.
server.use('/v1/api/devenv', devenvModule);
server.use('/v1/api/users', userModule);
server.use('/v1/admin', adminModule);
server.use('/v1/api/courses', coursesModule)

module.exports = server;