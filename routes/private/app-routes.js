const express = require('express');

const router = express.Router();
const trackController = require('../../controllers/track.controller');
const playlistController = require('../../controllers/playlist.controller.js');

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
try {
  const spotifyTracksIdArray = await trackController.getLikedSpotifyTrackIds(req.user);
  playlistController.addToSpotify(req.user, spotifyTracksIdArray);
  res.render('private/discovery/index', req.user);
} catch (err) {
  throw (err);
}
});

module.exports = router;
