const express = require('express');
const trackController = require('../../controllers/track.controller');
const playlistController = require('../../controllers/playlist.controller.js');
const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.post('/tracks/api/add-to-spotify', ensureAuthenticated, async (req, res) => {
  trackController.addAccessToken(req.user);
  const { spotifyId } = req.body;
  try {
    const added = await trackController.addTrackToSpotify([spotifyId]);
    res.status(200).json({ added });
  } catch (error) {
    res.status(404).json({ error });
  }
});


module.exports = router;