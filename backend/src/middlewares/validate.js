const Joi = require('joi');

/**
 * Validation des données utilisateur
 */
const usernameSchema = Joi.string().trim().required().pattern(/^[a-zA-Z0-9\s]{5,50}$/); // allow: letters, numbers and whiitespace, between 5 and 50 characters
const passwordSchema = Joi.string().trim().required().pattern(/^[a-zA-Z0-9-_@$!%*#\s]{5,50}$/); // allow letters, numbers, whiitespace, and some special chars, between 5 and 50 characters. (NO password strength requirements for the password, since the only user will be myself and it WILL be strong!)
// Lors du login
const loginUserSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema
});

exports.loginUser = (req, res, next) => {
  const {error, value} = loginUserSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: "Données saisies invalides" });
  } else {
    next();
  }
};