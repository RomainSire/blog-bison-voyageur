// Define TEST ENVIRONMENT
process.env.NODE_ENV = 'test';

// imports
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const app = require('../src/app')
const User = require('../src/models/User');

describe('User', () => {
  // DELETE EVERYTHING FROM THE TEST DATABASE BEFORE EVERY SINGLE TEST
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });


  /**************************************************************************
   * Test the GET /api/auth/firstuser route
   **************************************************************************/
  describe('GET /api/auth/firstuser', () => {
    it('should create a user if the database is empty', (done) => {
      chai.request(app)
        .get('/api/auth/firstuser')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('username').eql('admin');
          res.body.should.have.property('hash');
          res.body.should.have.property('created_at');
          res.body.should.have.property('modified_at');
          res.body.should.have.property('message').eql('utilisateur par défaut créé');
          done();
        });
    });
    it('should not create a user if a user already exists', (done) => {
      const now = new Date();
      const user = new User({
        created_at: now,
        modified_at: now,
        username: 'John Doe',
        hash: 'le hash super secure',
      })
      user.save()
        .then(() => {
          chai.request(app)
        .get('/api/auth/firstuser')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Des utilisateurs existent déjà');
          done();
        })
        })
    });
  })
})