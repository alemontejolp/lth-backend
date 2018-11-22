'use strict';

const router = require('express').Router();
const flows = require('./flows');

router.post('/signin', flows.signin);
router.post('/course', flows.createCourse);
router.post('/video', flows.createVideo);

module.exports = router;