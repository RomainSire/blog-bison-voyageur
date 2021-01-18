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
   * DELETE EVERYTHING FROM THE TEST DATABASE
   */
  beforeEach((done) => {
    Article.deleteMany({}, (err) => {
      done();
    });
  });

  /**
   * Test the /get route
   */
  describe('/GET/article', () => {
    it('should GET all the articles', (done) => {
      chai.request(app)
        .get('/api/article')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        })
    });
  });

});