const express = require('express');
const router = express.Router();
const accountCtrl = require('../../controllers/get/account.js')
const saveIP = require('../../middleware/save_ip.js')

router.get('/*', saveIP, accountCtrl.index);

module.exports = router;
