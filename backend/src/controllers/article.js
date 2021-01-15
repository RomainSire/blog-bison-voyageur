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
  Article.find()
    .then(articles => res.status(200).json(articles))
    .catch(error => res.status(400).json({ error }));
}