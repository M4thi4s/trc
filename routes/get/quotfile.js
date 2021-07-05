const express = require('express');
const router = express.Router();
const quotfileCtrl = require('../../controllers/get/quotfile.js')
const auth = require('../../middleware/auth.js');

//SET AUTHORIZATION BUT FOR TEST IS GLOBAL ACCESS

//router.get('/list', auth, quotfileCtrl.list);
router.get('/list', auth, quotfileCtrl.list);
//router.get('/get_strategy_JSON_file',  getStrategyFileCtrl.index);

module.exports = router;
