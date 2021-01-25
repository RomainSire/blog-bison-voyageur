// Define TEST ENVIRONMENT
process.env.NODE_ENV = 'test';

// imports
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const app = require('../src/app')
const Article = require('../src/models/Article');

describe('Article', () => {
  // DELETE EVERYTHING FROM THE TEST DATABASE BEFORE EVERY SINGLE TEST
  beforeEach((done) => {
    Article.deleteMany({}, (err) => {
      done();
    });
  });


  /**************************************************************************
   * Test the POST /api/article route
   **************************************************************************/
  describe('POST /api/article', () => {
    /**
     * 1 - Info requises manquantes = pas d'ajout
     */
    it('should not POST an article without "title" data', (done) => {
      const article = {
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false
      };
      chai.request(app)
        .post('/api/article')
        .set('Cookie', process.env.AUTH_COOKIE)
        .send(article)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('title');
          res.body.error.errors.title.should.have.property('kind').eql('required');
          done();
        });
    });
    it('should not POST an article without "slug" data', (done) => {
      const article = {
        title: "Voyage au Japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false
      };
      chai.request(app)
        .post('/api/article')
        .set('Cookie', process.env.AUTH_COOKIE)
        .send(article)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('slug');
          res.body.error.errors.slug.should.have.property('kind').eql('required');
          done();
        });
    });
    it('should not POST an article without "isdraft" data', (done) => {
      const article = {
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)"
      };
      chai.request(app)
        .post('/api/article')
        .set('Cookie', process.env.AUTH_COOKIE)
        .send(article)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('isdraft');
          res.body.error.errors.isdraft.should.have.property('kind').eql('required');
          done();
        });
    });
    /**
     * 2 - Ajout effectifs d'Articles
     */
    it('should POST an article with all data', (done) => {
      const article = {
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false
      };
      chai.request(app)
        .post('/api/article')
        .set('Cookie', process.env.AUTH_COOKIE)
        .send(article)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Article enregistré');
          res.body.should.have.property('_id');
          res.body.should.have.property('title').eql('Voyage au Japon');
          res.body.should.have.property('slug').eql('tdm-japon');
          res.body.should.have.property('image_id');
          res.body.should.have.property('description').eql('Une courte description de l\'article');
          res.body.should.have.property('content').eql('Le contenu super intéressant de l\'article : ce voyage était hyper stylé, on s\'est régalée :)');
          res.body.should.have.property('isdraft').eql(false);
          res.body.should.have.property('created_at');
          res.body.should.have.property('modified_at');
          done();
        });
    });
    it('should POST an article with only the required data', (done) => {
      const article = {
        title: "Voyage au Pérou",
        slug: "tdm-perou",
        isdraft: false
      };
      chai.request(app)
        .post('/api/article')
        .set('Cookie', process.env.AUTH_COOKIE)
        .send(article)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Article enregistré');
          res.body.should.have.property('_id');
          res.body.should.have.property('title').eql('Voyage au Pérou');
          res.body.should.have.property('slug').eql('tdm-perou');
          res.body.should.have.property('isdraft').eql(false);
          res.body.should.have.property('created_at');
          res.body.should.have.property('modified_at');
          done();
        });
    });
    /**
     * 3 - Infos uniques identiques à de précédents articles = pas d'ajout
     */
    it('should not POST an article if title already exists', (done) => {
      const now = new Date();
      const article1 = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false,
        created_at: now,
        modified_at: now
      });
      article1.save()
        .then(() => {
          const article2 = {
            title: "Voyage au Japon",
            slug: "qqch-different",
            image_id: 12,
            description: "qqch-different",
            content: "qqch-different",
            isdraft: false
          };
          chai.request(app)
          .post('/api/article')
          .set('Cookie', process.env.AUTH_COOKIE)
          .send(article2)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('title');
            res.body.error.errors.title.should.have.property('kind').eql('unique');
            done();
          });
        });
    });
    it('should not POST an article if slug already exists', (done) => {
      const now = new Date();
      const article1 = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false,
        created_at: now,
        modified_at: now
      });
      article1.save()
        .then(() => {
          const article = {
            title: "qqch-different",
            slug: "tdm-japon",
            image_id: 2,
            description: "qqch-different",
            content: "qqch-different",
            isdraft: false
          };
          chai.request(app)
            .post('/api/article')
            .set('Cookie', process.env.AUTH_COOKIE)
            .send(article)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('error');
              res.body.error.should.have.property('errors');
              res.body.error.errors.should.have.property('slug');
              res.body.error.errors.slug.should.have.property('kind').eql('unique');
              done();
            });
        });
    });
    it('should not POST an article if the user is not logged-in', (done) => {
      const article = {
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false
      };
      chai.request(app)
        .post('/api/article')
        .send(article)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Requête non authentifiée');
          done();
        });
    });
  })


  /**************************************************************************
   * Test the GET /api/article route
   **************************************************************************/
  describe('GET /api/article', () => {
    it('should GET no articles if DB empty', (done) => {
      chai.request(app)
        .get('/api/article')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('articles');
          res.body.articles.should.be.a('array')
          res.body.articles.length.should.be.eql(0);
          done();
        });
    });
    it('should GET 2 articles with all data', (done) => {
      const now = new Date();
      const article1 = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false,
        created_at: now,
        modified_at: now
      });
      const article2 = new Article({
        title: "Voyage au Pérou",
        slug: "tdm-perou",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article1.save()
        .then(() => {
          article2.save()
            .then(() => {
              chai.request(app)
              .get('/api/article')
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('articles');
                res.body.articles.should.be.a('array');
                res.body.articles.length.should.be.eql(2);
                res.body.articles[0].should.have.property('_id');
                res.body.articles[0].should.have.property('title').eql('Voyage au Japon');
                res.body.articles[0].should.have.property('slug').eql('tdm-japon');
                res.body.articles[0].should.have.property('image_id').eql(2);
                res.body.articles[0].should.have.property('description').eql('Une courte description de l\'article');
                res.body.articles[0].should.have.property('isdraft').eql(false);
                res.body.articles[0].should.have.property('created_at');
                res.body.articles[0].should.have.property('modified_at');
                res.body.articles[0].should.not.have.property('content');
                res.body.articles[1].should.have.property('_id');
                res.body.articles[1].should.have.property('title').eql('Voyage au Pérou');
                res.body.articles[1].should.have.property('slug').eql('tdm-perou');
                res.body.articles[1].should.have.property('isdraft').eql(true);
                res.body.articles[1].should.have.property('created_at');
                res.body.articles[1].should.have.property('modified_at');
                res.body.articles[1].should.not.have.property('content');
                done();
              });
            });
        });
    });
  });

  /**************************************************************************
   * Test the GET /api/article/:slug route
   **************************************************************************/
  describe('GET /api/article/:slug', () => {
    it('should GET no article if DB empty', (done) => {
      chai.request(app)
        .get('/api/article/' + 'tdm-japon')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('article').eql(null);
          done();
        });
    });
    it('should GET an article by the given slug', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(() => {
          chai.request(app)
          .get('/api/article/' + article.slug)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('article');
            res.body.article.should.be.a('object')
            res.body.article.should.have.property('_id');
            res.body.article.should.have.property('title').eql('Voyage au Japon');
            res.body.article.should.have.property('slug').eql('tdm-japon');
            res.body.article.should.have.property('image_id').eql(2);
            res.body.article.should.have.property('description').eql('Une courte description de l\'article');
            res.body.article.should.have.property('content').eql('Le contenu super intéressant de l\'article : ce voyage était hyper stylé, on s\'est régalée :)');
            res.body.article.should.have.property('isdraft').eql(false);
            res.body.article.should.have.property('created_at');
            res.body.article.should.have.property('modified_at');
            done();
          });
        });
    });
    it('should GET no article if the slug doesn\'t exixt', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(() => {
          chai.request(app)
          .get('/api/article/' + 'autre-slug')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('article').eql(null);
            done();
          });
        });
    });
  });


  /**************************************************************************
   * Test the PUT /api/article/:id route
   **************************************************************************/
  describe('PUT /api/article/:id', () => {
    it('should MODIFY an article by the given id', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(savedArticle => {
          const articleModified = {
            title: "Voyage au Japon",
            slug: "tdm-japon",
            image_id: 12,
            description: "description article",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vestibulum a urna quis elementum. Aliquam ullamcorper, massa vel rutrum semper, ex tellus maximus arcu, ut convallis nibh erat id risus. Proin a mi nisi. Phasellus vel elit vel odio commodo fermentum at ullamcorper sapien. Duis nunc diam, iaculis ut tempor eu, gravida ut odio. Vestibulum cursus dolor sed maximus ultrices. Maecenas vehicula convallis neque, ut iaculis odio volutpat ut. Phasellus dapibus egestas nibh, eget imperdiet diam sodales at. Nam eget velit non augue tristique sagittis ac ac orci.",
            isdraft: false
          };
          chai.request(app)
          .put('/api/article/' + savedArticle._id)
          .set('Cookie', process.env.AUTH_COOKIE)
          .send(articleModified)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Article modifié');
            done();
          });
        });
    });
    it('should MODIFY an article by the given id, even with partial info', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(savedArticle => {
          const articleModified = {
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vestibulum a urna quis elementum. Aliquam ullamcorper, massa vel rutrum semper, ex tellus maximus arcu, ut convallis nibh erat id risus. Proin a mi nisi. Phasellus vel elit vel odio commodo fermentum at ullamcorper sapien. Duis nunc diam, iaculis ut tempor eu, gravida ut odio. Vestibulum cursus dolor sed maximus ultrices. Maecenas vehicula convallis neque, ut iaculis odio volutpat ut. Phasellus dapibus egestas nibh, eget imperdiet diam sodales at. Nam eget velit non augue tristique sagittis ac ac orci."
          };
          chai.request(app)
          .put('/api/article/' + savedArticle._id)
          .set('Cookie', process.env.AUTH_COOKIE)
          .send(articleModified)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Article modifié');
            done();
          });
        });
    });
    it('should not MODIFY an article if another one have the same title', (done) => {
      const now = new Date();
      const article1 = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article1.save()
        .then(() => {
          const article2 = new Article({
            title: "Voyage au Pérou",
            slug: "tdm-perou",
            image_id: 12,
            description: "description de article",
            content: "contenu article",
            isdraft: true,
            created_at: now,
            modified_at: now
          });
          article2.save()
            .then(savedArticle => {
              const article2modified = {
                title: "Voyage au Japon",
              }
              chai.request(app)
              .put('/api/article/' + savedArticle._id)
              .set('Cookie', process.env.AUTH_COOKIE)
              .send(article2modified)
              .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.a('object');
                res.body.error.should.have.property('keyValue');
                res.body.error.keyValue.should.be.a('object');
                res.body.error.keyValue.should.have.property('title');
                done();
              });
            });
        });
    });
    it('should not MODIFY an article if another one have the same slug', (done) => {
      const now = new Date();
      const article1 = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article1.save()
        .then(() => {
          const article2 = new Article({
            title: "Voyage au Pérou",
            slug: "tdm-perou",
            image_id: 12,
            description: "description de article",
            content: "contenu article",
            isdraft: true,
            created_at: now,
            modified_at: now
          });
          article2.save()
            .then(savedArticle => {
              const article2modified = {
                slug: "tdm-japon",
              }
              chai.request(app)
              .put('/api/article/' + savedArticle._id)
              .set('Cookie', process.env.AUTH_COOKIE)
              .send(article2modified)
              .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.a('object');
                res.body.error.should.have.property('keyValue');
                res.body.error.keyValue.should.be.a('object');
                res.body.error.keyValue.should.have.property('slug');
                done();
              });
            });
        });
    });
    it('should return an error if ID doesn\'t exixt', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(() => {
          const articleModified = {
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          };
          chai.request(app)
          .put('/api/article/12')
          .set('Cookie', process.env.AUTH_COOKIE)
          .send(articleModified)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
        });
    });
    it('should not MODIFY an article if the user is not logged-in', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(savedArticle => {
          const articleModified = {
            title: "Voyage au Japon",
            slug: "tdm-japon",
            image_id: 12,
            description: "description article",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vestibulum a urna quis elementum. Aliquam ullamcorper, massa vel rutrum semper, ex tellus maximus arcu, ut convallis nibh erat id risus. Proin a mi nisi. Phasellus vel elit vel odio commodo fermentum at ullamcorper sapien. Duis nunc diam, iaculis ut tempor eu, gravida ut odio. Vestibulum cursus dolor sed maximus ultrices. Maecenas vehicula convallis neque, ut iaculis odio volutpat ut. Phasellus dapibus egestas nibh, eget imperdiet diam sodales at. Nam eget velit non augue tristique sagittis ac ac orci.",
            isdraft: false
          };
          chai.request(app)
          .put('/api/article/' + savedArticle._id)
          .send(articleModified)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql('Requête non authentifiée');
            done();
          });
        });
    });
  });


  /**************************************************************************
   * Test the DELETE /api/article/:id route
   **************************************************************************/
  describe('DELETE /api/article/:id', () => {
    it('should DELETE an article by the given id', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(savedArticle => {
          chai.request(app)
          .delete('/api/article/' + savedArticle._id)
          .set('Cookie', process.env.AUTH_COOKIE)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Article supprimé');
            done();
          });
        });
    });
    it('should return an error if the id doesn\'t exixt', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(savedArticle => {
          chai.request(app)
          .delete('/api/article/12')
          .set('Cookie', process.env.AUTH_COOKIE)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
        });
    });
    it('should not DELETE an article if the user is not logged-in', (done) => {
      const now = new Date();
      const article = new Article({
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: true,
        created_at: now,
        modified_at: now
      });
      article.save()
        .then(savedArticle => {
          chai.request(app)
          .delete('/api/article/' + savedArticle._id)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql('Requête non authentifiée');
            done();
          });
        });
    });
  });
});