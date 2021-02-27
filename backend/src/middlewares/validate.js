const Joi = require('joi');

/**
 * User's input validation of User's routes
 */
// Username: letters, numbers and whiitespace, between 5 and 50 characters
// Password: letters, numbers, whiitespace, and some special chars, between 5 and 50 characters.
// NO password strength requirements for the password, since the only user will be myself and it WILL be strong!
const usernameSchema = Joi.string().trim().required().pattern(/^[a-zA-Z0-9\s]{5,50}$/);
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


/**
 * User's input validation of Article's routes
 */
const titleSchema = Joi.string().trim().required().min(4).max(250);
const slugSchema = Joi.string().trim().required().pattern(/^[a-z0-9-]{4,250}$/);
const image_idSchema = Joi.number().integer().positive();
const descriptionSchema = Joi.string().trim().max(250);
const contentSchema = Joi.string().trim();
const isdraftSchema = Joi.boolean().required();

// post new article route
const addNewArticleSchema = Joi.object({
  title: titleSchema,
  slug: slugSchema,
  image_id: image_idSchema,
  description: descriptionSchema,
  content: contentSchema,
  isdraft: isdraftSchema
});
exports.addNewArticle = (req, res, next) => {
  const {error, value} = addNewArticleSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: "Données saisies invalides" });
  } else {
    next();
  }
};
