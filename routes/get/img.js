const express = require('express');
const router = express.Router();
const imgCtrl = require('../../controllers/get/img.js')

router.get('/*.svg',  imgCtrl.svg);
router.get('/*.png',  imgCtrl.png);
router.get('/*.jpg',  imgCtrl.jpg);

module.exports = router;
