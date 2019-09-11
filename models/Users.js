const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  spotifyId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
