const express = require('express');
const playlistController = require('../../controllers/playlist.controller.js');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    playlistController.addAccessToken(req.user.access_token);
    return next();
  }
  return res.status(403).json({error: 'Unauthorized' });
};


router.post('/spotify/add', ensureAuthenticated, async (req, res) => {
  const playlistName = req.body.playlist_name;
  try {
    const spotifyTracksIdArray = await trackController.getLikedSpotifyTrackIds(req.user);
    await playlistController.addToSpotify(req.user, spotifyTracksIdArray, playlistName);
    return res.status(200).json({ success: true, message: 'Playlist added to spotify' })
  } catch (err) {
    if (err.statusCode === 401) {
     return res.status(401).json({error: 'acess token expired' });
    }
    return res.status(400).json({error: err.message})
  }
});


router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const plalistInfo = await playlistController.getPlaylists(req.user);
    res.status(200).json({ playlists: plalistInfo });
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({error: 'acess token expired ' });
    }
    return res.status(400).json({error: error.message})
  }
});

router.post('/delete', ensureAuthenticated, async (req, res) => {
  const { playlistId } = req.body;
  try {
    await playlistController.removePlaylist(playlistId);
    return res.status(200).json({success: true, message: 'Playlist deleted'})
  } catch (error) {
    if (error.statusCode === 401) {
     return res.status(401).json({error: 'acess token expired' });
    }
    return res.status(404).json({ error });
  }
});



module.exports = router;
