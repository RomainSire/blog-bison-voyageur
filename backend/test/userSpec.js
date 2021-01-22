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
const userUtils = require('../src/utils/userUtils')

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
          });
        })
    });
  });


  /**************************************************************************
   * Test the POST /api/auth/login route
   **************************************************************************/
  describe('POST /api/auth/login', () => {
    it('should not connect if there is no user in DB', (done) => {
      const credential = {
        username: 'JohnDoe',
        password: 'monmotdepasse'
      };
      chai.request(app)
        .post('/api/auth/login')
        .send(credential)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Utilisateur invalide');
          done();
        });
    });
    it('should connect and get a cookie', async () => {
      const user = await userUtils.generateUserForDB('admin', 'password');
      const savedUser = await user.save();
      const credential = {
        username: 'admin',
        password: 'password'
      };
      chai.request(app)
        .post('/api/auth/login')
        .send(credential)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Utilisateur loggé');
          res.body.should.have.property('userId');
          res.body.userId.toString().should.eql(savedUser._id.toString());
          res.body.should.have.property('username').eql('admin');
          // Vérification: token dans cookie
          res.headers.should.be.a('object')
          res.headers.should.have.property('set-cookie');
          res.headers['set-cookie'].should.be.a('array');
          res.headers['set-cookie'].pop().split(';')[0].split('=')[0].should.eql('cryptedToken');
        })
    });
    it('should not connect if username is wrong', async () => {
      const user = await userUtils.generateUserForDB('admin', 'password');
      await user.save();
      const credential = {
        username: 'badlogin',
        password: 'password'
      };
      chai.request(app)
        .post('/api/auth/login')
        .send(credential)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Utilisateur invalide');
        })
    });
    it('should not connect if password is wrong', async () => {
      const user = await userUtils.generateUserForDB('admin', 'password');
      await user.save();
      const credential = {
        username: 'admin',
        password: 'badPassword'
      };
      chai.request(app)
        .post('/api/auth/login')
        .send(credential)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Mot de passe invalide');
        })
    });
  });
})