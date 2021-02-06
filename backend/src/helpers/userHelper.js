const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');

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