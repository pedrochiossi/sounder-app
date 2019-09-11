require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SpotifyWebApi = require('spotify-web-api-node');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../../models/Users');

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
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    console.log('usuario logado na callback: ', req.user);
    console.log('usuario logado ID: ', req.user.id);
    console.log('usuario logado Display Name: ', req.user.displayName);
    console.log('usuario logado Photos: ', req.user.photos[0]);
    console.log('usuario logado email: ', req.user.emails[0].value);

    const newUser = new User({ name, email, password: hash });
    newUser.save();

    res.redirect('/private/discovery/');
  },
);

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
})

router.get('/mytracks', (req, res) => {
  spotifyApi.getMySavedTracks({
    limit: 50,
    offset: 0,
    market: 'BR',
  })
    .then((tracks) => {
      console.log('Total: ', tracks.body.total);

      tracks.body.items.forEach((obj, index) => {
        console.log('name: ', obj.track.name, 'index: ', index);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
