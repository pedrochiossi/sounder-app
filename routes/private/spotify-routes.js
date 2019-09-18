const express = require('express');
const { addToSpotify } = require('../../controllers/add.to.spotify');

const spotifyRouter = express.Router();


spotifyRouter.get('/add-to-spotify', (req, res) => {
  const spotifyTracksIdArray = [] // aguardando função do pedro
  addToSpotify(req.user, spotifyTracksIdArray);
  res.render('private/discovery/index', req.user);
});

module.exports = spotifyRouter;
