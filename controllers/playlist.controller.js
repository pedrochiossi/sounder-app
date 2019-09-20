const SpotifyWebApi = require('spotify-web-api-node');
const Playlist = require('../models/Playlist');
const trackController = require('./track.controller');

const spotifyApi = new SpotifyWebApi({
  clientID: process.env.APPKEY,
  clientSecret: process.env.APPSECRET,
});

async function savePlaylistFromSpotify(user, playlist) {
  const getPlaylistFromSpotify = await spotifyApi.getPlaylist(playlist.body.id);

  const tracksArr = [];
  await getPlaylistFromSpotify.body.tracks.items.forEach((trackImgURL, position) => {
    if (position <= 3) {
      tracksArr.push(trackImgURL.track.album.images[1].url);
    }
  });

  const mongoTrackIds = await trackController.getLikedTrackIds();
  const date = new Date();

  try {
    await Playlist.create({
      tracks: mongoTrackIds,
      name: getPlaylistFromSpotify.body.name,
      user: user._id,
      created_at: date,
      spotify_id: playlist.body.id,
      images: tracksArr,
    });
  } catch (err) {
    throw err;
  }
}

async function addToSpotify(user, spotifyTracksIdArray) {
  spotifyApi.setAccessToken(user.access_token);

  const currentDate = new Date();
  const playlistName = `Sounder-app ${currentDate}`;

  try {
    const createPlaylsitInSpotify = await spotifyApi.createPlaylist(user.spotifyId, playlistName, { public: false });
    await spotifyApi.addTracksToPlaylist(createPlaylsitInSpotify.body.id, spotifyTracksIdArray);
    await savePlaylistFromSpotify(user, createPlaylsitInSpotify);
  } catch (err) {
    throw err;
  }
}

module.exports = { addToSpotify };
