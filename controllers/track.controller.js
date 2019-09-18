const SpotifyWebApi = require('spotify-web-api-node');
const Track = require('../models/Track');
const spotifyApi = new SpotifyWebApi({});


module.exports = {

  addAccessToken(user) {
    spotifyApi.setAccessToken(user.access_token);
  },

  async getTotal() {
    try {
      const data = await spotifyApi.getMySavedTracks({ limit: 1, offset: 1 });
      return data.body.total;
    } catch (error) {
      throw error;
    }
  },

  async getRandomTrackId(total) {
    try {
      const randomOffset = Math.floor(Math.random() * total);
      const randomTrack = await spotifyApi.getMySavedTracks({ limit: 1, randomOffset });
      return randomTrack.body.items[0].track.id;
    } catch (error) {
      throw error;
    }
  },

  async getRandomRecommendation(id) {
    try {
      const recomendation = await spotifyApi.getRecommendations({
        limit: 1,
        seed_tracks: id,
        min_popularity: 10,
      });
      const contains = await spotifyApi.containsMySavedTracks([recomendation.body.tracks[0].id]);
      const track = await Track.findOne({ spotify_id: recomendation.body.tracks[0].id });
      if (!contains.body[0] && !track) {
        return recomendation.body.tracks[0];
      }
      return this.getRandomRecommendation(id);
    } catch (error) {
      throw error;
    }
  },

  async saveTrack(track, user) {
    const date = new Date();
    try {
      await Track.create({
        spotify_id: track.id,
        name: track.name,
        album: track.album,
        artists: track.artists,
        popularity: track.popularity,
        preview_url: track.preview_url,
        user: user._id,
        created_at: date,
      });
      console.log('saved tracks to database!');
    } catch (error) {
      throw error;
    }
  },

  async getLikedSpotifyTrackIds() {
    try {
      const likedTracks = await Track.find({ liked: true, inPlaylist: false }, { spotify_id: true });
      const spotifyIds = likedTracks.map(track => `spotify:track:${track.spotify_id}`);
      return spotifyIds;
    } catch (error) {
      throw error;
    }
  },

  async getLikedTrackIds() {
    try {
      const likedTracks = await Track.find({ liked: true, inPlaylist: false }, { _id: true });
      const ids = likedTracks.map(el => el._id);
      return ids;
    } catch (error) {
      throw error;
    }
  },
};
