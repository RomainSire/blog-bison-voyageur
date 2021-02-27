const express = require('express');
const router = express.Router();

const articleCtrl = require('../controllers/article');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/', articleCtrl.getAllArticles);
router.get('/:slug', articleCtrl.getOneArticle);
router.post('/', auth, validate.article, articleCtrl.addArticle);
router.put('/:id', auth, validate.id, validate.article, articleCtrl.updateArticle);
router.delete('/:id', auth, validate.id, articleCtrl.deleteArticle);

module.exports = router;