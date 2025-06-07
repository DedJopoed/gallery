const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  description: String,
  url: String,
});

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  photos: [photoSchema],
});

module.exports = mongoose.model('Album', albumSchema);
