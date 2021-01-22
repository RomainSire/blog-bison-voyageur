const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.get('/firstuser', userCtrl.createFirstUser);
router.post('/login', userCtrl.login);
router.put('/username', userCtrl.changeUsername);
router.put('/password', userCtrl.changePassword);

module.exports = router;
