require('dotenv').config();

console.log('entrou aqui: ');
const mongoose = require('mongoose');
const { PlaylistTest } = require('../models/Playlist');

console.log('db strinnnnnnnnnng: ', process.env.MONGODB_URI);
mongoose
  .connect('mongodb://localhost/sounder-app', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const currentDate = new Date();

const playlist = {
    spotifyTracksId: ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M'],
    name: `Sounder-app smartplaylist ${currentDate}`,
  };

PlaylistTest.create(playlist, (err) => {
  if (err) { throw (err); }
  mongoose.connection.close();
});

const playlistRecent = PlaylistTest.findOne({}, {}, { sort: { 'created_at' : -1 } });
console.log ('detalhe da playlis: ', playlistRecent.schema.paths.spotifyTracksId);