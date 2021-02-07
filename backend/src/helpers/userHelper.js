const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const Cookies = require('cookies');

const User = require('../models/User');


/**
 * Generate a user ready to save in DB
 * @param {String} login user name
 * @param {String} password Password
 * @returns {User} Ready to save user object, corresponding to User Model
 */
exports.generateUserForDB = async (login, password) => {
  const bcryptHash = await bcrypt.hash(password, 12);
  const saferHash = cryptojs.AES.encrypt(bcryptHash, process.env.KEY_PASSWORD).toString();
  const now = new Date();
  return user = new User({
    username: login,
    hash: saferHash,
    created_at: now,
    modified_at: now
  });
}


/**
 * Authenticate a user
 * @param {String} username User's username
 * @param {String} password User's password
 * @returns {User} User object, corresponding to User Model
 * @throws {String} if invalid user or password
 */
exports.authenticateUser = async (username, password) => {
  // Recherche user
  const user = await User.findOne({ username });
  if (!user) {
    throw 'Utilisateur invalide';
  }
  // décryptage & validation du hash
  const databaseHash = cryptojs.AES.decrypt(user.hash, process.env.KEY_PASSWORD).toString(cryptojs.enc.Utf8);
  const valid = await bcrypt.compare(password, databaseHash);
  if (!valid) {
    throw 'Mot de passe invalide';
  }
  return user;
}


/**
 * Check if the password or a user is correct with its user id
 * @param {String} userId User id
 * @param {String} password User Password
 * @returns {User} User object, corresponding to user model
 * @throws {String} if invalid userId or Password
 */
exports.checkPasswordWithUserId = async (userId, password) => {
  const user = await User.findOne({ _id: userId});
  if (!user) {
    throw 'Utilisateur invalide';
  }
  // décryptage & validation du hash
  const databaseHash = cryptojs.AES.decrypt(user.hash, process.env.KEY_PASSWORD).toString(cryptojs.enc.Utf8);
  const valid = await bcrypt.compare(password, databaseHash);
  if (!valid) {
    throw 'Mot de passe invalide';
  }
  return user;
}


/**
 * Get the user Id stored in his cookie
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {String} User Id
 */
exports.getUserIdFromCookie = (req, res) => {
  const cryptedCookie = new Cookies(req, res).get('cryptedToken');
  return JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.KEY_COOKIE).toString(cryptojs.enc.Utf8)).userId;
}