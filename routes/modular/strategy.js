const express = require('express');
const router = express.Router();
const strategyGetCtrl = require('../../controllers/get/strategy.js');
const strategyPostCtrl = require('../../controllers/post/strategy.js')
const auth = require('../../middleware/auth.js');
const createFoler = require('../../middleware/generate_path.js');

router.get('/listJSON', auth, strategyGetCtrl.listJSON);
router.get('/listCSV', auth, strategyGetCtrl.listCSV);
router.post('/downCSV', auth, strategyPostCtrl.downCSV);
router.post('/exec', auth, createFoler, strategyPostCtrl.exec);

module.exports = router;
