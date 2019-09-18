const express = require('express');
const { addToSpotify } = require('../../controllers/add.to.spotify');

const spotifyRouter = express.Router();

spotifyRouter.get('/add-to-spotify', (req, res) => {
  // aguardando função spotifyTracksIdArray do Pedro
  const spotifyTracksIdArray = ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M'];
  addToSpotify(req.user, spotifyTracksIdArray);
  res.render('private/discovery/index', req.user);
});

module.exports = spotifyRouter;
