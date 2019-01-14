'use strict';

const flow = {};
const handlers = require('./handlers');
const midd = require('../../lib/middlewares');

flow.signup = [
  midd.appAuth,
  handlers.signup
];

flow.signin = [
  midd.appAuth,
  handlers.signin
];

flow.getUserData = [
  midd.appAuth,
  midd.userAuth,
  handlers.getUserData
];

module.exports = flow;