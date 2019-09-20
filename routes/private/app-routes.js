const express = require('express');

const router = express.Router();
const trackController = require('../../controllers/track.controller');
const { addToSpotify } = require('../../controllers/playlist.controller.js');

router.get('/discovery', async (req, res) => {
  const { user } = req;
  trackController.addAccessToken(user);
  try {
    const total = await trackController.getTotal();
    const randomId = await trackController.getRandomTrackId(total);
    const recommendation = await trackController.getRandomRecommendation(randomId);
    await trackController.saveTrack(recommendation, req.user);
    res.render('private/discovery/index', recommendation);
  } catch (err) {
    console.log(err);
  }
});

router.get('/add-to-spotify', async (req, res) => {
  const tracksId = await trackController.getLikedSpotifyTrackIds();
  const spotifyTracksIdArray = tracksId;
  addToSpotify(req.user, spotifyTracksIdArray);
  res.render('private/discovery/index', req.user);
});

module.exports = router;
