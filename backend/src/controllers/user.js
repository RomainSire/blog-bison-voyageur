const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.createFirstUser = async (req, res, next) => {
  try {
    const DBUsers = await User.find()
    if (DBUsers.length === 0) {
      const hash = await bcrypt.hash('admin', 12);
      const now = new Date();
      const user = new User({
        username: 'admin',
        hash: hash,
        created_at: now,
        modified_at: now
      });
      const savedUser = await user.save()
      return res.status(201).json({ ...savedUser._doc, message: 'utilisateur par défaut créé' });
    } else {
      return res.status(400).json({ message: 'Des utilisateurs existent déjà' });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}

exports.login = (req, res ,next) => {

}

exports.changeUsername = (req, res, next) => {

}

exports.changePassword = (req, res, next) => {

}
