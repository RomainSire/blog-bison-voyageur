const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  created_at: { type: Date, required: true },
  modified_at: { type: Date, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  image_id: { type: Number, required: false },
  content: { type: String, required: false },
  isdraft: { type: Boolean, required: true }
});

module.exports = mongoose.model('Article', articleSchema);