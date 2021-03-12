const SpotifyWebApi = require('spotify-web-api-node');
const Track = require('../models/Track');
const AppError = require('../errors/AppError');

class TrackController {
  constructor() {
    this.api = new SpotifyWebApi({});
  }

  addAccessToken(token) {
    this.api.setAccessToken(token);
  }

  async getTotal() {
    try {
      const data = await this.api.getMySavedTracks({ limit: 1, offset: 1 });
      return data.body.total;
    } catch (error) {
      throw new AppError(error.message, error.statusCode)
    }
  }

  async getRandomTrackId(total) {
    try {
      const randomOffset = Math.floor(Math.random() * total);
      const randomTrack = await this.api.getMySavedTracks({ limit: 1, offset: randomOffset });
      return randomTrack.body.items[0].track.id;
    } catch (error) {
      throw new AppError(error.message, error.statusCode);;
    }
  }

  async getRandomRecommendation(id, user) {
    try {
      const recomendation = await this.api.getRecommendations({
        limit: 1,
        seed_tracks: id,
        min_popularity: 10,
      });
      const { id: trackId, preview_url } = recomendation.body.tracks[0]
      const contains = await this.api.containsMySavedTracks([trackId]);
      const track = await Track.findOne({ spotify_id: trackId, user: user._id });
      if (!contains.body[0] && !track && preview_url !== null) {
        return recomendation.body.tracks[0];
      }
      return this.getRandomRecommendation(id, user);
    } catch (error) {
      throw new AppError(error.message, error.statusCode);;
    }
  }

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
      throw new AppError(error.message, error.statusCode);;
    }
  }

  async updateLiked(id, liked) {
    try {
      const track = await Track.findOneAndUpdate({ _id: id }, { liked });
      return `track: ${track.name} updated successfully!`;
    } catch (error) {
      throw new AppError(error.message, error.statusCode);;
    }
  }

  async updateInPlaylist(ids) {
    try {
      await Track.updateMany({ _id: ids }, { inPlaylist: true });
    } catch (error) {
      throw new AppError(error.message, error.statusCode);;
    }
  }

  async getNewTrack(user) {
    try {
      const total = await this.getTotal();
      const randomId = await this.getRandomTrackId(total);
      const recommendation = await this.getRandomRecommendation(randomId, user);
      const newTrack = await this.saveTrack(recommendation, user);
      return newTrack;
    } catch (error) {
      throw new AppError(error.message, error.statusCode);;
    }
  }

  async getLikedTracks(user) {
    try {
      const likedTracks = await Track.find({ liked: true, inPlaylist: false, user: user._id });
      return likedTracks;
    } catch (error) {
      throw new AppError(error.message, error.statusCode);;
    }
  }

  async addTrackToSpotify(idArray) {
    try {
      await this.api.addToMySavedTracks(idArray);
      await Track.findOneAndUpdate({ spotify_id: idArray[0] }, { savedOnSpotify: true });
    } catch (error) {
      throw new AppError(error.message, error.statusCode);
    }
  }

  async removeTrackFromSpotify(idArray) {
    try {
      await this.api.removeFromMySavedTracks(idArray)
      await Track.findOneAndUpdate({ spotify_id: idArray[0]}, { savedOnSpotify: false });
    } catch (error) {
      throw new AppError(error.message, error.statusCode);
    }
  }

  async getNullTrack(user) {
    try {
      const nullTrack = await Track.find({ liked: null, user: user._id });
      return nullTrack;
    } catch (error) {
      throw new AppError(error.message, error.statusCode);;
    }
  }
}

module.exports = TrackController;
