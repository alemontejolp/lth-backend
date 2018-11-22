'use strict';

const router = require('express').Router();
const flows = require('./flows');

router.post('/signup', flows.signup);
router.post('/signin', flows.signin);

module.exports = router;