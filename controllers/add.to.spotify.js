const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientID: process.env.APPKEY,
  clientSecret: process.env.APPSECRET,
});

function addToSpotify(user, spotifyTracksIdArray) {
  spotifyApi.setAccessToken(user.access_token);

  const currentDate = new Date();
  const playlistName = `Sounder-app ${currentDate}`;

  spotifyApi.createPlaylist(user.spotifyId, playlistName, { public: false })
    .then((playlistData) => {
      console.log('Created playlist! ', playlistData);

      // add track to this created playlist:
      // spotifyApi.addTracksToPlaylist(playlistData.body.id, ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M'])
      spotifyApi.addTracksToPlaylist(playlistData.body.id, spotifyTracksIdArray)
        .then((tracksData) => {
          console.log('Added tracks to playlist!', tracksData);
        }, (err) => {
          console.log('adding track went wrong!', err);
        });
    }, (err) => {
      console.log('Something went wrong!', err);
    });
}

module.exports = { addToSpotify };
