const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

const User = require('../models/User');
const userUtils = require('../utils/userUtils');


exports.createFirstUser = async (req, res, next) => {
  try {
    const DBUsers = await User.find();
    if (DBUsers.length === 0) {
      const user = await userUtils.generateUserForDB('admin', 'admin');
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
  try {
    // Recherche user
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur invalide' });
    }
    // décryptage & validation du hash
    const databaseHash = cryptojs.AES.decrypt(user.hash, process.env.KEY_PASSWORD).toString(cryptojs.enc.Utf8);
    const valid = await bcrypt.compare(req.body.password, databaseHash);
    if (!valid) {
      return res.status(401).json({ error: 'Mot de passe invalide' });
    }
    // Création d'un JWT
    const newToken = jwt.sign(
      { userId: user._id },
      process.env.KEY_JWT,
      { expiresIn: '4h' }
    );
    // Création du contenu du cookie avec le JWT
    const cookieContent = {
      token: newToken,
      userId: user._id
    };
    // Cryptage du contenu du cookie avant de l'envoyer
    const cryptedCookie = cryptojs.AES.encrypt(JSON.stringify(cookieContent), process.env.KEY_COOKIE).toString();
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

exports.changeUsername = (req, res, next) => {

}

exports.changePassword = (req, res, next) => {

}
