const express = require('express');
const router = express.Router();
const homeCtrl = require('../../controllers/get/home.js')
const saveIP = require('../../middleware/save_ip.js')

router.get('/', saveIP, homeCtrl.index);

module.exports = router;
