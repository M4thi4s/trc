const express = require('express');
const router = express.Router();
const scriptCtrl = require('../../controllers/get/script.js')

router.get('/*.js', scriptCtrl.js);

module.exports = router;
