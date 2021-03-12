const express = require('express');
const colorThief = require('colorthief');
const TrackController = require('../../controllers/track.controller');
const AppError = require('../../errors/AppError');

const router = express.Router();
const trackController = new TrackController();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    trackController.addAccessToken(req.user.access_token);
    return next();
  }
  throw new AppError('Unauthorized', 403);
};

router.get('/new', ensureAuthenticated, async (req, res, next) => {
  try {
    const { user } = req;
    const nullTrack = await trackController.getNullTrack(user);
    if (nullTrack.length > 0) {
      const colors = await colorThief.getColor(nullTrack[0].album.images[0].url);
      return res.status(200).json({ track: nullTrack[0], colors: colors.join(',') });
    } else {
      const newTrack = await trackController.getNewTrack(user);
      const colors = await colorThief.getColor(newTrack.album.images[0].url);
      return res.status(200).json({ track: newTrack, colors: colors.join(',') });
    }
  } catch (error) {
    return next(error);
  }
});

router.patch('/set-liked', ensureAuthenticated, async (req, res, next) => {
  try {
    const { liked, id } = req.body;
    await trackController.updateLiked(id, (liked === 'true'));
    res.status(200).json({success: true, message: 'Track status updated'})
  } catch (error) {
    next(error);
  }
});

router.get('/liked', ensureAuthenticated, async (req, res, next) => {
  try {
    const myTracks = await trackController.getLikedTracks(req.user);
    res.status(200).json({ tracks: myTracks });
  } catch(error) {
    next(error);
  }
});

router.post('/spotify/like', ensureAuthenticated, async (req, res, next) => {
  try {
    const { spotifyId } = req.body;
    await trackController.addTrackToSpotify([spotifyId]);
    return res.status(200).json({success: true, message: 'Track added to liked songs playlist' });
  } catch(error) {
    next(error);
  }
});

router.post('/spotify/dislike', ensureAuthenticated, async (req, res, next) => {
  try {
    const { spotifyId } = req.body;
    await trackController.removeTrackFromSpotify([spotifyId]);
    return res.status(200).json({success: true, message: 'Track removed from liked songs playlist' })
  } catch (error) {
    next(error);
  }
})

module.exports = router;
