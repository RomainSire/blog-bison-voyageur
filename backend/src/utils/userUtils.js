const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');

const User = require('../models/User');

/**
 * Generate a user ready to save in DB
 * @param {String} login user name
 * @param {String} password Password
 * @returns {Object} Ready to save user, corresponding to User Model
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