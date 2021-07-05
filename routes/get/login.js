const express = require('express');
const router = express.Router();
const loginCtrl = require('../../controllers/get/login.js')

router.get('/*',  loginCtrl.index);

module.exports = router;
