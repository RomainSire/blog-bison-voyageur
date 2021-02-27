const express = require('express');
const router = express.Router();

const articleCtrl = require('../controllers/article');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/', articleCtrl.getAllArticles);
router.get('/:slug', articleCtrl.getOneArticle);
router.post('/', auth, validate.addNewArticle, articleCtrl.addArticle);
router.put('/:id', auth, articleCtrl.updateArticle);
router.delete('/:id', auth, articleCtrl.deleteArticle);

module.exports = router;