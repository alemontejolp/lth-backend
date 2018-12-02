'use strict';

const flow = {};
const handler = require('./handlers');
const midd = require('../../services/middlewares');
const conf = require('../../config');
const videos = require('multer')({ dest: conf.videoPath });

flow.signin = [
  midd.appAuth,
  handler.signin
];

flow.createCourse = [
  midd.appAuth,
  midd.userAuth,
  handler.createCourse
];

flow.createVideo = [
  midd.appAuth,
  midd.userAuth,
  videos.single('video'),
  handler.creationVideo
];

module.exports = flow;