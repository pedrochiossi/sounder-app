const express = require('express');
const trackController = require('../../controllers/track.controller');
const playlistController = require('../../controllers/playlist.controller.js');
const userController = require('../../controllers/user.controller');
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
    if (error.statusCode === 401) {
      try {
        await userController.resetToken(req.user);
        res.redirect('/tracks');
      } catch (err) {
        console.log(err);
      }
    }
    res.status(404).json({ error });
  }
});

router.post('/playlists/api/delete/', ensureAuthenticated, async (req, res) => {
  trackController.addAccessToken(req.user);
  const { playlistId } = req.body;
  try {
    await playlistController.removePlaylist(playlistId);
    const playlists = await playlistController.getPlaylists(req.user);
    res.status(200).json({ playlists });
  } catch (error) {
    if (error.statusCode === 401) {
      try {
        await userController.resetToken(req.user);
        res.redirect('/playlists');
      } catch (err) {
        console.log(err);
      }
    }
    res.status(404).json({ error });
  }
});

module.exports = router;