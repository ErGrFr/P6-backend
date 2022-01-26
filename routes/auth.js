
const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');
const checkpassword = require('../middleware/checkpassword');

router.post('/login', authCtrl.login);
router.post('/signup', checkpassword, authCtrl.signup);


module.exports = router;