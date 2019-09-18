const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientID: process.env.APPKEY,
  clientSecret: process.env.APPSECRET,
});

async function addToSpotify(user, spotifyTracksIdArray) {
  spotifyApi.setAccessToken(user.access_token);

  const currentDate = new Date();
  const playlistName = `Sounder-app ${currentDate}`;

  try {
    const addPlaylsit = await spotifyApi.createPlaylist(user.spotifyId, playlistName, { public: false });
    const addTracks = await spotifyApi.addTracksToPlaylist(addPlaylsit.body.id, spotifyTracksIdArray);
  } catch (err) {
    console.log('playlist or track creating error: ', err);
  }

}

module.exports = { addToSpotify };