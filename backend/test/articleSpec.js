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
  /**
   * Test the GET /api/article route
   */
  describe('GET /api/article', () => {
    // DELETE EVERYTHING FROM THE TEST DATABASE
    before((done) => {
      Article.deleteMany({}, (err) => {
        done();
      });
    });

    it('should GET all the articles', (done) => {
      chai.request(app)
        .get('/api/article')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /**
   * Test the POST /api/article route
   */
  describe('POST /api/article', () => {
    // DELETE EVERYTHING FROM THE TEST DATABASE
    before((done) => {
      Article.deleteMany({}, (err) => {
        done();
      });
    });
    /**
     * Info requises manquantes = pas d'ajout
     */
    it('should not POST an article without title', (done) => {
      const article = {
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
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('title');
          res.body.error.errors.title.should.have.property('kind').eql('required');
          done();
        });
    });
    it('should not POST an article without slug', (done) => {
      const article = {
        title: "Voyage au Japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false
      };
      chai.request(app)
        .post('/api/article')
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
    it('should not POST an article without isdraft', (done) => {
      const article = {
        title: "Voyage au Japon",
        slug: "tdm-japon",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)"
      };
      chai.request(app)
        .post('/api/article')
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
     * Ajout effectifs d'Articles
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
        .send(article)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Article enregistré');
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
        .send(article)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Article enregistré');
          done();
        });
    });
    /**
     * Infos uniques identiques à de précédents articles = pas d'ajout
     */
    it('should not POST an article if title already exists', (done) => {
      const article = {
        title: "Voyage au Japon",
        slug: "tdm-japon2",
        image_id: 2,
        description: "Une courte description de l'article",
        content: "Le contenu super intéressant de l'article : ce voyage était hyper stylé, on s'est régalée :)",
        isdraft: false
      };
      chai.request(app)
        .post('/api/article')
        .send(article)
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
    it('should not POST an article if slug already exists', (done) => {
      const article = {
        title: "Voyage au Japon 2",
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
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('slug');
          res.body.error.errors.slug.should.have.property('kind').eql('unique');
          done();
        });
    });
    /**
     * Il devrait y avoir 2 articles avec les données qu'on vient d'ajouter
     */
    it('should GET 2 articles in DB with data previously added', (done) => {
      chai.request(app)
        .get('/api/article')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('title');
          res.body[0].should.have.property('slug');
          res.body[0].should.have.property('image_id');
          res.body[0].should.have.property('description');
          res.body[0].should.have.property('isdraft');
          res.body[0].should.have.property('created_at');
          res.body[0].should.have.property('modified_at');
          res.body[0].should.not.have.property('content');
          res.body[1].should.have.property('_id');
          res.body[1].should.have.property('title');
          res.body[1].should.have.property('slug');
          res.body[1].should.have.property('isdraft');
          res.body[1].should.have.property('created_at');
          res.body[1].should.have.property('modified_at');
          res.body[1].should.not.have.property('content');
          done();
        });
    });
  })

  /**
   * Test the GET /api/article/:id route
   */
  describe('GET /api/article/:id', () => {
    
  });

});