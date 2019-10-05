require('dotenv').config();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const hbs = require('hbs');
const User = require('./models/User');

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session({
  secret: 'basic-auth-secret',
  cookie: { maxAge: 3600000 * 24 * 14 },
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.APPKEY,
      clientSecret: process.env.APPSECRET,
      callbackURL: process.env.CALLBACKURI,
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      User.findOneAndUpdate({ spotifyId: profile.id }, { access_token: accessToken }, { new: true })
        .then((user) => {
          if (user) {
            done(null, user);
            return;
          }
          User.create({
            spotifyId: profile.id,
            name: profile.displayName,
            imageURL: profile.photos[0],
            email: profile.emails[0].value,
            access_token: accessToken,
            refresh_token: refreshToken,
          })
            .then((newUser) => {
              done(null, newUser);
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    },
  ),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
}));

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

const index = require('./routes/public/index');
const authRoutes = require('./routes/public/auth-routes');

app.use('/', index);
app.use('/', authRoutes);


const appRoutes = require('./routes/private/app-routes');

app.use('/', appRoutes);

const apiRoutes = require('./routes/private/app-routes-api');

app.use('/', apiRoutes);

module.exports = app;