const express = require('express');
const router = express.Router();
const userCtrl = require('../../controllers/post/user.js')
const auth = require('../../middleware/auth.js');
const check_usr = require('../../middleware/check_usr.js');

router.post('/signup', check_usr, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/checkAuthentification', auth, userCtrl.checkAuthentification);

module.exports = router;
