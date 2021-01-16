const Article = require('../models/Article');

exports.addArticle = (req, res, next) => {
  const now = new Date();
  const article = new Article({
    ...req.body,
    created_at: now,
    modified_at: now
  });
  article.save()
    .then(() => res.status(201).json({ message: 'Article enregistré'}))
    .catch(error => res.status(400).json({ error }));
}

exports.getAllArticles = (req, res, next) => {
  Article.find().select('title description slug image_id isdraft created_at modified_at')
    .then(articles => res.status(200).json(articles))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneArticle = (req, res, next) => {
  Article.findOne({slug: req.params.slug})
    .then(article => res.status(200).json(article))
    .catch(error => res.status(404).json({ error }));
}

exports.updateArticle = (req, res, next) => {
  const now = new Date();
  Article.updateOne({slug: req.params.slug}, {...req.body, modified_at: now})
    .then(() => res.status(201).json({ message: 'Article modifié'}))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteArticle = (req, res, next) => {
  Article.deleteOne({slug: req.params.slug})
    .then(() => res.status(200).json({ message: 'Article supprimé'}))
    .catch(error => res.status(400).json({ error }));
}