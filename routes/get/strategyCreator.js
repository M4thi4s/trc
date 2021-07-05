const express = require('express');
const router = express.Router();
const strategyCreatorCtrl = require('../../controllers/get/strategy_creator.js')

router.get('/*',  strategyCreatorCtrl.index);

module.exports = router;
