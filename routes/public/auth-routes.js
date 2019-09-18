require('dotenv').config();
const express = require('express');
const passport = require('passport');
const router = express.Router();
const trackController = require('../../controllers/track.controller');
router.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'playlist-modify-public', 'playlist-modify-private', 'user-read-private', 'user-library-read', 'user-library-modify'],
    showDialog: false,
  }), (req, res) => {

  },
);

router.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/discovery');
  });


router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/discovery', async (req, res) => {
  const { user } = req;
  trackController.addAccessToken(user);
  try {
    const total = await trackController.getTotal();
    const randomId = await trackController.getRandomTrackId(total);
    console.log(randomId);
    const recommendation = await trackController.getRandomRecommendation(randomId);
    const newTrack = await trackController.saveTrack(recommendation, req.user);
    res.render('private/discovery/index', recommendation);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
