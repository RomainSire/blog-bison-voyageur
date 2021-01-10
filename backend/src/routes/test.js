const express = require('express');
const router = express.Router();

// import Controlleurs
const testCtrl = require('../controllers/test');

router.get('/bonjour', testCtrl.bonjour);

module.exports = router;