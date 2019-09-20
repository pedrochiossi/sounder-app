const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  spotifyId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: String,
  imageURL: { type: String, default: 'images/avatar.png' },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
