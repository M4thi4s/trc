const express = require('express');
const router = express.Router();
const jsonCtrl = require('../../controllers/get/json.js')

router.get('/*.json',  jsonCtrl.json);

module.exports = router;
