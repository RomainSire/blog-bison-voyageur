const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  created_at: { type: Date, required: true },
  modified_at: { type: Date, required: true },
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
