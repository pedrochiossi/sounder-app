const SpotifyWebApi = require('spotify-web-api-node');
const Playlist = require('../models/Playlist');
const trackController = require('./track.controller');

const spotifyApi = new SpotifyWebApi({
  clientID: process.env.APPKEY,
  clientSecret: process.env.APPSECRET,
});

async function savePlaylistFromSpotify(user, playlist) {
  const playlistFromSpotify = await spotifyApi.getPlaylist(playlist.body.id);

  const imgURLs = [];
  const itemsArray = playlistFromSpotify.body.tracks.items;

  for (let i = 0; i < itemsArray.length; i += 1) {
    if (i < 4) {
      imgURLs[i] = itemsArray[i].track.album.images[1].url;
    } else {
      break;
    }
  }

  const mongoTrackIds = await trackController.getLikedTrackIds(user);
  const date = new Date();

  try {
    await Playlist.create({
      tracks: mongoTrackIds,
      name: playlistFromSpotify.body.name,
      user: user._id,
      created_at: date,
      spotify_id: playlist.body.id,
      images: imgURLs,
    });
  } catch (err) {
    throw err;
  }

  await trackController.updateInPlaylist(mongoTrackIds);
}

async function addToSpotify(user, spotifyTracksIdArray, playlistName) {
  spotifyApi.setAccessToken(user.access_token);
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
  addToSpotify,
  savePlaylistFromSpotify,
  getPlaylists,
  removePlaylist,
};
