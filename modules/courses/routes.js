'use strict';

const router = require('express').Router();
const flow = require('./flows');

router.get('/find', flow.findCourses);
router.get('/:course/videos', flow.getVideos);
router.post('/:course/buy', flow.buyCourse);
router.get('/video/:video', flow.getVideoData);
router.get('/purchased', flow.getPurchasedCourses);

module.exports = router;