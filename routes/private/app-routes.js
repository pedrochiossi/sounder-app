const express = require('express');
const colorThief = require('colorthief');
const trackController = require('../../controllers/track.controller');
const playlistController = require('../../controllers/playlist.controller.js');

const router = express.Router();

// eslint-disable-next-line consistent-return
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.get('/discovery', ensureAuthenticated, async (req, res) => {
  const { user } = req;
  trackController.addAccessToken(user);
  try {
    const newTrack = await trackController.getNewTrack(user);
    const colors = await colorThief.getColor(newTrack.album.images[0].url);
    res.render('private/discovery/index', { track: newTrack, colors: colors.join(','), user });
  } catch (err) {
    console.log(err);
  }
});

router.post('/add-to-spotify', ensureAuthenticated, async (req, res) => {
  const playlistName = req.body.playlist_name;
  try {
    const spotifyTracksIdArray = await trackController.getLikedSpotifyTrackIds(req.user);
    await playlistController.addToSpotify(req.user, spotifyTracksIdArray, playlistName);
    res.redirect('/playlists');
  } catch (err) {
    throw (err);
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
    console.log(error);
  }
});

router.get('/playlists', ensureAuthenticated, async (req, res) => {
  const plalistInfo = await playlistController.getPlaylists(req.user);
  res.render('private/playlist/index', { playlists: plalistInfo, user: req.user });
});

router.post('/playlists/delete/:playlistId', ensureAuthenticated, async (req, res) => {
  const id = req.params.playlistId;
  try {
    await playlistController.removePlaylist(id);
  } catch (error) {
    console.log(error);
  }
  res.redirect('/playlists');
});

router.get('tracks/', ensureAuthenticated, async (req, res) => {
  try {
    const { likedTracks, imgURLs } = await trackController.getLikedNewTracks(req.user);
  res.render('private/track/index', { tracks: likedTracks, imageURL: imgURLs, user: req.user });
  } catch (error) {
    console.log(error);
  }
});

router.post('tracks/add-to-spotify', ensureAuthenticated, async (req, res) => {
  const { spotifyId } = req.body;
  try {
    trackController.addTrackToSpotify([spotifyId]);
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
