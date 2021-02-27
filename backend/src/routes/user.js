const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/firstuser', userCtrl.createFirstUser);
router.post('/login', validate.loginUser, userCtrl.login);
router.put('/username', auth, validate.changeUsername, userCtrl.changeUsername);
router.put('/password', auth, validate.changePassword, userCtrl.changePassword);

module.exports = router;
