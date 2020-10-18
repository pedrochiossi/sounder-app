const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/User');

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
            premium: profile.product === 'premium',
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

