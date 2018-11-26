'use strict';

const flows = {};
const middlewares = require('../../services/middlewares');
const handlers = require('./handlers');

flows.findCourses = [
  handlers.getCourses
];

flows.getVideos = [
  middlewares.userAuth,
  handlers.getVideos
];

flows.buyCourse = [
  middlewares.userAuth,
  handlers.buyCourse
];

flows.getVideoData = [
  middlewares.userAuth,
  handlers.getVideoData
];

flows.getPurchasedCourses = [
  middlewares.userAuth,
  handlers.getPurchasedCourses
];

module.exports = flows;