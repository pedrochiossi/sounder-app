require('dotenv').config();
const express = require('express');
const passport = require('passport');
const router = express.Router();

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

router.get('/discovery', (req, res) => {
  res.render('private/discovery/index', req.user);
});

module.exports = router;
