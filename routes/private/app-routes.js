const express = require('express');

const router = express.Router();
const trackController = require('../../controllers/track.controller');
const playlistController = require('../../controllers/playlist.controller.js');

// eslint-disable-next-line consistent-return
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.get('/discovery', ensureAuthenticated, async (req, res) => {
  const { user } = req;
  trackController.addAccessToken(user);
  try {
    const total = await trackController.getTotal();
    const randomId = await trackController.getRandomTrackId(total);
    const recommendation = await trackController.getRandomRecommendation(randomId, user);
    const newTrack = await trackController.saveTrack(recommendation, user);
    res.render('private/discovery/index', newTrack);
  } catch (err) {
    console.log(err);
  }
});

router.get('/add-to-spotify', ensureAuthenticated, async (req, res) => {
  try {
    const spotifyTracksIdArray = await trackController.getLikedSpotifyTrackIds(req.user);
    playlistController.addToSpotify(req.user, spotifyTracksIdArray);
    res.redirect('/playlists');
  } catch (err) {
    throw (err);
  }
});

router.post('/discovery/set-liked', ensureAuthenticated, async (req, res) => {
  try {
    const { liked, id } = req.body;
    if (liked === 'true') {
      const updated = await trackController.updateLiked(id, true);
      console.log(updated);
    } else {
      const updated = await trackController.updateLiked(id, false);
      console.log(updated);
    }
    res.redirect('/discovery');
  } catch (error) {
    console.log(error);
  }
});

router.get('/playlists', ensureAuthenticated, async (req, res) => {
  const plalistInfo = await playlistController.displayPlaylists(req.user);
  console.log(req.user)
  res.render('private/playlist/index', { playlists: plalistInfo, user: req.user });
})

router.get('/delete/playlist/:playlistId', ensureAuthenticated, async (req, res) => {
  const id = req.params.playlistId;
  console.log('o que é esse id', id);
  const playlistUpdated = await playlistController.removePlaylistAndUpdate(id, req.user);
  res.redirect('/playlists');
})

module.exports = router;
