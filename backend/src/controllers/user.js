const Cookies = require('cookies');

const User = require('../models/User');
const userHelper = require('../helpers/userHelper');
const securityHelper = require('../helpers/securityHelper');


exports.createFirstUser = async (req, res, next) => {
  try {
    const DBUsers = await User.find();
    if (DBUsers.length === 0) {
      const user = await userHelper.generateUserForDB('admin', 'admin');
      const savedUser = await user.save()
      return res.status(201).json({ ...savedUser._doc, message: 'utilisateur par défaut créé' });
    } else {
      return res.status(400).json({ message: 'Des utilisateurs existent déjà' });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}

exports.login = async (req, res ,next) => {
  let user;
  // authentification de l'utilisateur
  try {
    user = await userHelper.authenticateUser(req.body.username, req.body.password)
  } catch (error) {
    return res.status(401).json({ error });
  }
  try {
    // création et envoi du JWT crypté
    const cryptedCookie = securityHelper.createCryptedJWTCookie(user._id);
    new Cookies(req, res).set('cryptedToken', cryptedCookie, {
      httpOnly: true,
      maxAge: 14400000  // cookie pendant 4 heures
    })
    // Envoi de la réponse
    res.status(200).json({
      message: 'Utilisateur loggé',
      userId: user._id,
      username: user.username
    })
  } catch (error) {
    return res.status(500).json({ error });
  }
}

exports.changeUsername = async (req, res, next) => {
  try {
    const userId = userHelper.getUserIdFromCookie(req, res);
    await userHelper.checkPasswordWithUserId(userId, req.body.password);
    User.updateOne({ _id: userId }, { username: req.body.newUsername })
    .then(() => res.status(201).json({ message: 'Username modifié', username: req.body.newUsername }))
    .catch(error => res.status(400).json({ error }));
  } catch (error) {
    return res.status(401).json({ error });
  }
}

exports.changePassword = (req, res, next) => {

}
