const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/firstuser', userCtrl.createFirstUser);
router.post('/login', userCtrl.login);
router.put('/username', auth, userCtrl.changeUsername);
router.put('/password', auth, userCtrl.changePassword);

module.exports = router;
