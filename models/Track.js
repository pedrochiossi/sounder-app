const mongoose = require('mongoose');

const { Schema } = mongoose;

const trackSchema = new Schema ({
  spotify_id: String,
  name: String,
  album: Object,
  artists: [Object],
  popularity: Number,
  preview_url: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, required: true, enum: ['liked', 'unliked', 'unspecified'] },
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
