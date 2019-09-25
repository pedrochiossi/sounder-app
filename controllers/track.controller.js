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
      const randomTrack = await spotifyApi.getMySavedTracks({ limit: 1, offset: randomOffset });
      return randomTrack.body.items[0].track.id;
    } catch (error) {
      throw error;
    }
  },

  async getRandomRecommendation(id, user) {
    try {
      const recomendation = await spotifyApi.getRecommendations({
        limit: 1,
        seed_tracks: id,
        min_popularity: 10,
      });
      const contains = await spotifyApi.containsMySavedTracks([recomendation.body.tracks[0].id]);
      const track = await Track.findOne({ spotify_id: recomendation.body.tracks[0].id, user: user._id });
      if (!contains.body[0] && !track && recomendation.body.tracks[0].preview_url !== null) {
        return recomendation.body.tracks[0];
      }
      return this.getRandomRecommendation(id, user);
    } catch (error) {
      throw error;
    }
  },

  async saveTrack(track, user) {
    const date = new Date();
    try {
      const newTrack = await Track.create({
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
      return newTrack;
    } catch (error) {
      throw error;
    }
  },

  async getLikedSpotifyTrackIds(user) {
    try {
      const likedTracks = await this.getLikedTracks(user)
      const spotifyIds = likedTracks.map(track => `spotify:track:${track.spotify_id}`);
      return spotifyIds;
    } catch (error) {
      throw error;
    }
  },

  async getLikedTrackIds(user) {
    try {
      const likedTracks = await this.getLikedTracks(user);
      const ids = likedTracks.map(track => track._id);
      return ids;
    } catch (error) {
      throw error;
    }
  },

  async updateLiked(id, liked) {
    try {
      const track = await Track.findOneAndUpdate({ _id: id }, { liked });
      return `track: ${track.name} updated successfully!`;
    } catch (error) {
      throw error;
    }
  },

  async updateInPlaylist(ids) {
    try {
      await Track.updateMany({ _id: ids }, { inPlaylist: true });
    } catch (error) {
      throw error;
    }
  },

  async getNewTrack(user) {
    try {
      const total = await this.getTotal();
      const randomId = await this.getRandomTrackId(total);
      const recommendation = await this.getRandomRecommendation(randomId, user);
      const newTrack = await this.saveTrack(recommendation, user);
      return newTrack;
    } catch (error) {
      throw error;
    }
  },

  async getLikedTracks(user) {
    try {
      const likedTracks = await Track.find({ liked: true, inPlaylist: false, user: user._id }, { _id: true });
      return likedTracks;
    } catch (error) {
      throw error;
    }
  },

  async addTrackToSpotify(idArray) {
    try {
      await spotifyApi.addToMySavedTracks(idArray);
    } catch (error) {
      throw error;
    }
  },
};
