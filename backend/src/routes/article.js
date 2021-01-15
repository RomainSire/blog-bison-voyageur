const express = require('express');
const router = express.Router();

// import Controlleurs
const articleCtrl = require('../controllers/article');

router.get('/', articleCtrl.getAllArticles);
router.post('/', articleCtrl.addArticle);

module.exports = router;