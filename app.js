require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const mongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser'); // para que serve?
const logger = require('morgan'); // para que serve?
const path = require('path'); // para que serve?
const passport = require('passport');
const SpotifyWebApi = require('spotify-web-api-node');
const SpotifyStrategy = require('./lib/passport-spotify/index').Strategy;

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
    }
  )
);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('public/index', { user: req.user });
});

app.get('/private/discovery/', (req, res) => {
  console.log('user: ', req.user);
  res.render('private/discovery/index', { user: req.user });
});

app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'user-read-recently-played', 'user-library-read', 'user-library-modify'],
    showDialog: true
  }),
  function(req, res) {

  }
);

app.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/private/discovery/');
  }
);

app.get('/mytracks', (req, res) => {

  spotifyApi.getMySavedTracks()
    .then((tracks) => {
      console.log('tacks', tracks.body.items[0])
    })
    .catch((err) => {
      console.log(err);
    });
})

module.exports = app;