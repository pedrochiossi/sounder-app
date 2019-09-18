const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientID: process.env.APPKEY,
  clientSecret: process.env.APPSECRET,
});

async function addToSpotify(user, spotifyTracksIdArray) {
  spotifyApi.setAccessToken(user.access_token);

  const currentDate = new Date();
  const playlistName = `Sounder-app ${currentDate}`;

  const addPlaylsit = await spotifyApi.createPlaylist(user.spotifyId, playlistName, { public: false });
  const addTracks = await spotifyApi.addTracksToPlaylist(addPlaylsit.body.id, spotifyTracksIdArray);

}

module.exports = { addToSpotify };
