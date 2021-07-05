const express = require('express');
const router = express.Router();
const cssCtrl = require('../../controllers/get/css.js')

router.get('/*.css',  cssCtrl.css);

module.exports = router;
