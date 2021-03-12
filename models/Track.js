const mongoose = require('mongoose');

const { Schema } = mongoose;

const trackSchema = new Schema({
  spotify_id: String,
  name: String,
  album: Object,
  artists: [Object],
  popularity: Number,
  preview_url: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  liked: {
    type: Schema.Types.Mixed,
    enum: [true, false, null],
    default: null,
  },
  inPlaylist: { type: Boolean, default: false },
  savedOnSpotify: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;


