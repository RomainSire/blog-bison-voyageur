// Define TEST ENVIRONMENT
process.env.NODE_ENV = 'test';

// imports
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const app = require('../src/app')
const User = require('../src/models/User');
const userHelper = require('../src/helpers/userHelper');
const securityHelper = require('../src/helpers/securityHelper');

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
      });
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
        });
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
    it('should connect and get a cookie', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then((savedUser) => {
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
              done();
            });
        });
      });
    });
    it('should not connect if username doesn\'t match the one in DB', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then(() => {
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
              done();
            });
        });
      });
    });
    it('should not connect if password doesn\'t match the one in DB', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then(() => {
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
              done();
            });
        });
      });
    });
    it('should not connect if username is not a string', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then(() => {
          const credential = {
            username: 12,
            password: 'password'
          };
          chai.request(app)
            .post('/api/auth/login')
            .send(credential)
            .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('Données saisies invalides');
              done();
            });
        });
      });
    });
    it('should not connect if username is not long enough', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then(() => {
          const credential = {
            username: 'Jo',
            password: 'password'
          };
          chai.request(app)
            .post('/api/auth/login')
            .send(credential)
            .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('Données saisies invalides');
              done();
            });
        });
      });
    });
    it('should not connect if username has special character', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then(() => {
          const credential = {
            username: 'admin#',
            password: 'password'
          };
          chai.request(app)
            .post('/api/auth/login')
            .send(credential)
            .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('Données saisies invalides');
              done();
            });
        });
      });
    });
    it('should not connect if password is not a string', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then(() => {
          const credential = {
            username: 'admin',
            password: 12
          };
          chai.request(app)
            .post('/api/auth/login')
            .send(credential)
            .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('Données saisies invalides');
              done();
            });
        });
      });
    });
    it('should not connect if password is too short', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then(() => {
          const credential = {
            username: 'admin',
            password: 'pass'
          };
          chai.request(app)
            .post('/api/auth/login')
            .send(credential)
            .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('Données saisies invalides');
              done();
            });
        });
      });
    });
    it('should not connect if password has unallowed special character', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((user) => {
        user.save().then(() => {
          const credential = {
            username: 'admin',
            password: 'password//'
          };
          chai.request(app)
            .post('/api/auth/login')
            .send(credential)
            .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('Données saisies invalides');
              done();
            });
        });
      });
    });
  });


  /**************************************************************************
   * Test the PUT /api/auth/username route
   **************************************************************************/
  describe('PUT /api/auth/username', () => {
    it('should update a user\'s username', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((testUser) => {
        testUser.save().then(() => {
          userHelper.authenticateUser('admin', 'password').then((user) => {
            const cryptedCookie = securityHelper.createCryptedJWTCookie(user._id);
            const cookieHeader = "cryptedToken=" + cryptedCookie;
            const bodyRequest = {
              newUsername: "John Doe",
              password: "password"
            };
            chai.request(app)
              .put('/api/auth/username')
              .set('Cookie', cookieHeader)
              .send(bodyRequest)
              .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Username modifié');
                res.body.should.have.property('username').eql(bodyRequest.newUsername);
                done();
              });
          });
        });
      });
    });
    it('should not update username if password is wrong', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((testUser) => {
        testUser.save().then(() => {
          userHelper.authenticateUser('admin', 'password').then((user) => {
            const cryptedCookie = securityHelper.createCryptedJWTCookie(user._id);
            const cookieHeader = "cryptedToken=" + cryptedCookie;
            const bodyRequest = {
              newUsername: "John Doe",
              password: "badPassword"
            };
            chai.request(app)
              .put('/api/auth/username')
              .set('Cookie', cookieHeader)
              .send(bodyRequest)
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('Mot de passe invalide');
                done();
              });
          });
        });
      });
    });
    it('should not update username if user is not logged in', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((testUser) => {
        testUser.save().then(() => {
          const bodyRequest = {
            newUsername: "John Doe",
            password: "password"
          };
          chai.request(app)
            .put('/api/auth/username')
            .send(bodyRequest)
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


  /**************************************************************************
   * Test the PUT /api/auth/password route
   **************************************************************************/
  describe('PUT /api/auth/password', () => {
    it('should update a user\'s password', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((testUser) => {
        testUser.save().then(() => {
          userHelper.authenticateUser('admin', 'password').then((user) => {
            const cryptedCookie = securityHelper.createCryptedJWTCookie(user._id);
            const cookieHeader = "cryptedToken=" + cryptedCookie;
            const bodyRequest = {
              newPassword: "secret",
              oldPassword: "password"
            };
            chai.request(app)
              .put('/api/auth/password')
              .set('Cookie', cookieHeader)
              .send(bodyRequest)
              .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Mot de passe modifié');
                done();
              });
          });
        });
      });
    });
    it('should not update password if oldPassword is wrong', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((testUser) => {
        testUser.save().then(() => {
          userHelper.authenticateUser('admin', 'password').then((user) => {
            const cryptedCookie = securityHelper.createCryptedJWTCookie(user._id);
            const cookieHeader = "cryptedToken=" + cryptedCookie;
            const bodyRequest = {
              newPassword: "secret",
              oldPassword: "wrongPassword"
            };
            chai.request(app)
              .put('/api/auth/password')
              .set('Cookie', cookieHeader)
              .send(bodyRequest)
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('Mot de passe invalide');
                done();
              });
          });
        });
      });
    });
    it('should not update username if user is not logged in', (done) => {
      userHelper.generateUserForDB('admin', 'password').then((testUser) => {
        testUser.save().then(() => {
          const bodyRequest = {
            newPassword: "secret",
              oldPassword: "password"
          };
          chai.request(app)
            .put('/api/auth/password')
            .send(bodyRequest)
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

});