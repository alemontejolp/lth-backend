'use strict';

const flow = {};
const handler = require('./handlers');
const midd = require('../../services/middlewares');
const conf = require('../../config');
const videos = require('multer')({ dest: conf.videoPath });

flow.signin = [
  handler.signin
];

flow.createCourse = [
  midd.userAuth,
  handler.createCourse
];

flow.createVideo = [
  midd.userAuth,
  videos.single('video'),
  handler.creationVideo
];

module.exports = flow;