'use strict';

const flows = {};
const middlewares = require('../../lib/middlewares');
const handlers = require('./handlers');

flows.findCourses = [
  middlewares.appAuth,
  handlers.getCourses
];

flows.getVideos = [
  middlewares.appAuth,
  middlewares.userAuth,
  handlers.getVideos
];

flows.buyCourse = [
  middlewares.appAuth,
  middlewares.userAuth,
  handlers.buyCourse
];

flows.getVideoData = [
  middlewares.appAuth,
  middlewares.userAuth,
  handlers.getVideoData
];

flows.getPurchasedCourses = [
  middlewares.appAuth,
  middlewares.userAuth,
  handlers.getPurchasedCourses
];

module.exports = flows;