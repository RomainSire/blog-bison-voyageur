const Joi = require('joi');

/**
 * Validation des données utilisateur
 */
// Username: letters, numbers and whiitespace, between 5 and 50 characters
const usernameSchema = Joi.string().trim().required().pattern(/^[a-zA-Z0-9\s]{5,50}$/);
// Password: letters, numbers, whiitespace, and some special chars, between 5 and 50 characters.
// NO password strength requirements for the password, since the only user will be myself and it WILL be strong!
const passwordSchema = Joi.string().trim().required().pattern(/^[a-zA-Z0-9-_@$!%*#\s]{5,50}$/);

// Login route
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

// Change username route
const changeUsernameScheme = Joi.object({
  newUsername: usernameSchema,
  password: passwordSchema
});
exports.changeUsername = (req, res, next) => {
  const {error, value} = changeUsernameScheme.validate(req.body);
  if (error) {
    res.status(422).json({ error: "Données saisies invalides" });
  } else {
    next();
  }
};

// Change password route
const changePasswordScheme = Joi.object({
  newPassword: passwordSchema,
  oldPassword: passwordSchema
});
exports.changePassword = (req, res, next) => {
  const {error, value} = changePasswordScheme.validate(req.body);
  if (error) {
    res.status(422).json({ error: "Données saisies invalides" });
  } else {
    next();
  }
};
