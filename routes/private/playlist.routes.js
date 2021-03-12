const express = require('express');
const PlaylistController = require('../../controllers/playlist.controller.js');
const TrackController = require('../../controllers/track.controller.js');
const AppError = require('../../errors/AppError');


const router = express.Router();
const playlistController = new PlaylistController();
const trackController = new TrackController();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    playlistController.addAccessToken(req.user.access_token);
    return next();
  }
  throw new AppError('Unauthorized', 403);
};

router.post('/spotify/add', ensureAuthenticated, async (req, res, next) => {
  try {
    const playlistName = req.body.playlist_name;
    const likedTracks = await trackController.getLikedTracks(req.user);
    const spotifyTrackIds = likedTracks.map(track => `spotify:track:${track.spotify_id}`);
    const trackIds = likedTracks.map(track => track._id);
    const newPlaylist = await playlistController.addToSpotify(
      req.user,
      spotifyTrackIds,
      playlistName
    );
    await playlistController.savePlaylistFromSpotify(req.user, newPlaylist, trackIds);
    await trackController.updateInPlaylist(trackIds);
    return res.status(200).json({ success: true, message: 'Playlist added to spotify' })
  } catch(error) {
    next(error);
  }
});

router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const playlists = await playlistController.getPlaylists(req.user);
    res.status(200).json({ playlists });
  } catch(error) {
    next(error);
  }
});

router.post('/delete', ensureAuthenticated, async (req, res, next) => {
  try {
    const { playlistId } = req.body;
    await playlistController.removePlaylist(playlistId);
    return res.status(200).json({success: true, message: 'Playlist deleted'})
  } catch (error) {
    next(error);
  }
});

module.exports = router;
