require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
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
  cookie: { maxAge: 60000000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

const index = require('./routes/public/index');
const authRoutes = require('./routes/public/auth-routes');

app.use('/', index);
app.use('/', authRoutes);

module.exports = app;