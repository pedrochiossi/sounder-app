const express = require('express');
const colorThief = require('colorthief');
const axios = require('axios');
const qs = require('qs');
const trackController = require('../../controllers/track.controller');
const playlistController = require('../../controllers/playlist.controller.js');
const User = require('../../models/User');


const router = express.Router();

// eslint-disable-next-line consistent-return
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

async function resetToken(user) {
  const data = qs.stringify({
    grant_type: 'refresh_token',
    refresh_token: user.refresh_token,
    client_id: process.env.APPKEY,
    client_secret: process.env.APPSECRET,
  });
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', data, headers);
    await User.findOneAndUpdate({ _id: user._id }, { access_token: response.data.access_token });
  } catch (error) {
    console.log(error);
  }
}

router.get('/discovery', ensureAuthenticated, async (req, res) => {
  const { user } = req;
  trackController.addAccessToken(user);
  try {
    const nullTrack = await trackController.getNullTrack(user);
    if (nullTrack.length > 0) {
      const colors = await colorThief.getColor(nullTrack[0].album.images[0].url);
      res.render('private/discovery/index', { track: nullTrack[0], colors: colors.join(','), user });
    } else {
      const newTrack = await trackController.getNewTrack(user);
      const colors = await colorThief.getColor(newTrack.album.images[0].url);
      res.render('private/discovery/index', { track: newTrack, colors: colors.join(','), user });
    }
  } catch (err) {
    if (err.statusCode === 401) {
      resetToken(user);
      res.redirect('/discovery');
    }
    console.log(err);
  }
});

router.post('/playlists/add-to-spotify', ensureAuthenticated, async (req, res) => {
  const playlistName = req.body.playlist_name;
  try {
    const spotifyTracksIdArray = await trackController.getLikedSpotifyTrackIds(req.user);
    await playlistController.addToSpotify(req.user, spotifyTracksIdArray, playlistName);
    res.redirect('/playlists');
  } catch (err) {
    if (err.statusCode === 401) {
      resetToken(req.user);
      res.redirect('/playlists');
    }
    console.log(err);
  }
});

router.post('/discovery/set-liked', ensureAuthenticated, async (req, res) => {
  try {
    const { liked, id } = req.body;
    if (liked === 'true') {
      await trackController.updateLiked(id, true);
    } else {
      await trackController.updateLiked(id, false);
    }
    res.redirect('/discovery');
  } catch (error) {
    if (error.statusCode === 401) {
      resetToken(req.user);
      res.redirect('/discovery');
    }
    console.log(error);
  }
});

router.get('/playlists', ensureAuthenticated, async (req, res) => {
  const plalistInfo = await playlistController.getPlaylists(req.user);
  res.render('private/playlist/index', { playlists: plalistInfo, user: req.user });
});

router.get('/tracks', ensureAuthenticated, async (req, res) => {
  try {
    const myTracks = await trackController.getLikedTracks(req.user);
    res.render('private/track/index', { myTracks, user: req.user });
  } catch (error) {
    if (error.statusCode === 401) {
      resetToken(req.user);
      res.redirect('/tracks');
    }
    console.log(error);
  }
});

module.exports = router;
