const express = require('express');
const router = express.Router();
const createStratCtrl = require('../../controllers/post/createstrat.js')
const auth = require('../../middleware/auth.js');
const check_strategy = require('../../middleware/check_strategy.js');
const createFoler = require('../../middleware/generate_path.js');

router.post('/*', auth, check_strategy, createFoler, createStratCtrl.createStrat);

module.exports = router;
