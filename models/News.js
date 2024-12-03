// Model for News 
// Used for Validation
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  weblink: {type: String, required: true},
  image: {type: String, required: true},
});

module.exports = mongoose.model('News', NewsSchema);
