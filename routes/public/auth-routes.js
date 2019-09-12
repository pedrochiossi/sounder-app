require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SpotifyWebApi = require('spotify-web-api-node');
const SpotifyStrategy = require('passport-spotify').Strategy;
const { findOrCreateUser } = require('../../controllers/user.controller');

const router = express.Router();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const spotifyApi = new SpotifyWebApi({
  clientID: process.env.APPKEY,
  clientSecret: process.env.APPSECRET,
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.APPKEY,
      clientSecret: process.env.APPSECRET,
      callbackURL: process.env.CALLBACKURI,
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      process.nextTick(() => {
        spotifyApi.setAccessToken(accessToken);

        return done(null, profile);
      });
    },
  ),
);

router.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.get('/private/discovery/', (req, res) => {
  res.render('private/discovery/index', { user: req.user });
});

router.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'playlist-modify-public', 'playlist-modify-private', 'user-read-private', 'user-library-read', 'user-library-modify'],
    showDialog: true,
  }),
  (req, res) => {

  },
);

router.get(
  '/fetch-user',
  passport.authenticate('spotify', { failureRedirect: '/' }), findOrCreateUser);

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;
