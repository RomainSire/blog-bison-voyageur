const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const articleSchema = mongoose.Schema({
  created_at: { type: Date, required: true },
  modified_at: { type: Date, required: true },
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  image_id: { type: Number, required: false },
  content: { type: String, required: false },
  isdraft: { type: Boolean, required: true }
});

articleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Article', articleSchema);