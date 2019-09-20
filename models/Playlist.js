const mongoose = require('mongoose');

const { Schema } = mongoose;

// const playlistSchema = new Schema({
//   tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
//   name: { type: String, required: true },
//   user: { type: Schema.Types.ObjectId, ref: 'User' },
//   created_at: Date,
//   spotify_id: String,
//   images: [String],
// });

const playlistSchema = new Schema({
  tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: Date,
  spotify_id: String,
  images: [String],
});
const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
