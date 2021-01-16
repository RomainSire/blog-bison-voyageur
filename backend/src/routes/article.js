const express = require('express');
const router = express.Router();

// import Controlleurs
const articleCtrl = require('../controllers/article');

router.get('/', articleCtrl.getAllArticles);
router.get('/:slug', articleCtrl.getOneArticle);
router.post('/', articleCtrl.addArticle);
router.put('/:slug', articleCtrl.updateArticle);
router.delete('/:slug', articleCtrl.deleteArticle);

module.exports = router;