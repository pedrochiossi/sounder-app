require('dotenv').config();
const passport = require('passport');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const logger = require('morgan');
const authRoutes = require('./routes/public/auth.routes');
const trackRoutes = require('./routes/private/track.routes');
const playlistRoutes = require('./routes/private/playlist.routes');
const path = require('path');
const AppError = require('./errors/AppError');

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
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));


app.use(cors());
app.use(passport.initialize());
require('./config/passport');
app.use(passport.session());


app.use('/api', authRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/playlists', playlistRoutes );

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error(err);
  
  return res.status(500).json({ 
    status: 'error', 
    message: 'Internal server error' 
  });
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  })
}

module.exports = app;