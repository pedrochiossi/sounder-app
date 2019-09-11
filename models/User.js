const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  spotifyId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: String,
  imageURL: String,
  createdPlaylists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
