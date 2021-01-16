const express = require('express');
const router = express.Router();

// import Controlleurs
const articleCtrl = require('../controllers/article');

router.get('/', articleCtrl.getAllArticles);
router.get('/:id', articleCtrl.getOneArticle);
router.post('/', articleCtrl.addArticle);
router.put('/:id', articleCtrl.updateArticle);
router.delete('/:id', articleCtrl.deleteArticle);

module.exports = router;