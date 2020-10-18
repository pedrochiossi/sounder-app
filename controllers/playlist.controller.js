const SpotifyWebApi = require('spotify-web-api-node');
const Playlist = require('../models/Playlist');
const trackController = require('./track.controller');

const spotifyApi = new SpotifyWebApi({});

function addAccessToken(token) {
  spotifyApi.setAccessToken(token);
}

function generatePlaylistImages(items) {
  const imgURLs = [];

  for (let i = 0; i < 4; i += 1) {
    imgURLs[i] = items[i].track.album.images[1].url;
  };

  return imgURLs;
}

async function savePlaylistFromSpotify(user, playlist) {
  const playlistFromSpotify = await spotifyApi.getPlaylist(playlist.body.id);

  const { items } = playlistFromSpotify.body.tracks;
  const images = generatePlaylistImages(items);

  const mongoTrackIds = await trackController.getLikedTrackIds(user);
  const date = new Date();

  try {
    await Playlist.create({
      tracks: mongoTrackIds,
      name: playlistFromSpotify.body.name,
      user: user._id,
      created_at: date,
      spotify_id: playlist.body.id,
      images
    });
  } catch (err) {
    throw err;
  }

  await trackController.updateInPlaylist(mongoTrackIds);
}

async function addToSpotify(user, spotifyTracksIdArray, playlistName) {
  try {
    const playlistInSpotify = await spotifyApi.createPlaylist(user.spotifyId, playlistName, { public: false });
    await spotifyApi.addTracksToPlaylist(playlistInSpotify.body.id, spotifyTracksIdArray);
    await savePlaylistFromSpotify(user, playlistInSpotify);
  } catch (err) {
    throw err;
  }
}

async function getPlaylists(user) {
  try {
    const playlists = await Playlist.find({ user: user._id }).sort({ created_at: -1 });
    return playlists;
  } catch (err) {
    throw err;
  }
}

async function removePlaylist(id) {
  try {
    const updatedPlaylist = await Playlist.findOneAndRemove({ _id: id });
    return updatedPlaylist;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  addAccessToken,
  addToSpotify,
  savePlaylistFromSpotify,
  getPlaylists,
  removePlaylist,
};
