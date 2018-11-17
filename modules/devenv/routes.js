'use strict';

const router = require('express').Router();
const flows = require('./flows');

router.post('/run', flows.run);

module.exports = router;