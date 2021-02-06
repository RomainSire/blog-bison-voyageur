const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

/**
 * Crée un cookie crypté contenant le JWT d'authentification (double sécurité..!)
 * @param {Number} userId L'id de l'utilisateur authentifié
 * @returns {String} cookie crypté du JWT
 */
exports.createCryptedJWTCookie = (userId) => {
  // Création d'un JWT
  const newToken = jwt.sign(
    { userId: userId },
    process.env.KEY_JWT,
    { expiresIn: '4h' }
  );
  // Création du contenu du cookie avec le JWT
  const cookieContent = {
    token: newToken,
    userId: userId
  };
  // Cryptage du contenu du cookie avant de l'envoyer
  return cryptojs.AES.encrypt(JSON.stringify(cookieContent), process.env.KEY_COOKIE).toString();
}