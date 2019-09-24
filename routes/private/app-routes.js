const express = require('express');
const colorThief = require('colorthief');
const router = express.Router();
const trackController = require('../../controllers/track.controller');
const { addToSpotify } = require('../../controllers/playlist.controller.js');

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
    const colors = await colorThief.getColor(newTrack.album.images[0].url);

    res.render('private/discovery/index', { track: newTrack, colors: colors.join(',') });
  } catch (err) {
    console.log(err);
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


router.get('/add-to-spotify', ensureAuthenticated, async (req, res) => {
  const spotifyTracksIdArray = await trackController.getLikedSpotifyTrackIds(req.user);
  addToSpotify(req.user, spotifyTracksIdArray);
  res.render('private/discovery/index', req.user);
});

module.exports = router;
