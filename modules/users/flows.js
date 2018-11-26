'use strict';

const flow = {};
const handlers = require('./handlers');
const midd = require('../../services/middlewares');

flow.signup = [
  handlers.signup
];

flow.signin = [
  handlers.signin
];

flow.getUserData = [
  midd.userAuth,
  handlers.getUserData
];

module.exports = flow;