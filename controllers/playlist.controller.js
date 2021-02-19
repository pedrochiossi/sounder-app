const SpotifyWebApi = require('spotify-web-api-node');
const Playlist = require('../models/Playlist');
const AppError = require('../errors/AppError');

class PlaylistController {
  constructor() {
    this.api = new SpotifyWebApi({});
  }

  addAccessToken(token) {
    this.api.setAccessToken(token);
  }

  generatePlaylistImages(items) {
    const imgURLs = [];
    for (let i = 0; i < 4; i += 1) {
      imgURLs[i] = items[i].track.album.images[1].url;
    };
    return imgURLs;
  }

  async savePlaylistFromSpotify(user, playlist, tracks) {
    const playlistFromSpotify = await this.api.getPlaylist(playlist.body.id);
  
    const { items } = playlistFromSpotify.body.tracks;
    const images = this.generatePlaylistImages(items);
    const date = new Date();
  
    try {
      await Playlist.create({
        tracks,
        name: playlistFromSpotify.body.name,
        user: user._id,
        created_at: date,
        spotify_id: playlist.body.id,
        images
      });
    } catch (err) {
      throw new AppError(err.message, err.statusCode);;
    }
  }

  async addToSpotify(user, spotifyTracks, playlistName) {
    try {
      const playlist = await this.api.createPlaylist(
        user.spotifyId,
        playlistName, 
        { public: false }
      );
      await this.api.addTracksToPlaylist(playlist.body.id, spotifyTracks);
      return playlist;
    } catch (err) {
      throw new AppError(err.message, err.statusCode);;
    }
  }

  async getPlaylists(user) {
    try {
      const playlists = await Playlist.find({ user: user._id }).sort({ created_at: -1 });
      return playlists;
    } catch (err) {
      throw new AppError(err.message, err.statusCode);;
    }
  }

  async removePlaylist(id) {
    try {
      const updatedPlaylist = await Playlist.findOneAndRemove({ _id: id });
      return updatedPlaylist;
    } catch (err) {
      throw new AppError(err.message, err.statusCode);;
    }
  }
};

module.exports = PlaylistController;