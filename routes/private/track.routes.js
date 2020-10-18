const express = require('express');
const colorThief = require('colorthief');
const trackController = require('../../controllers/track.controller');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    trackController.addAccessToken(req.user.access_token);
    return next();
  }
  return res.status(403).json({error: 'Unauthorized' });
};


router.get('/new', ensureAuthenticated, async (req, res) => {
  const { user } = req;
  try {
    const nullTrack = await trackController.getNullTrack(user);
    if (nullTrack.length > 0) {
      const colors = await colorThief.getColor(nullTrack[0].album.images[0].url);
      return res.status(200).json({ track: nullTrack[0], colors: colors.join(',') });
    } else {
      const newTrack = await trackController.getNewTrack(user);
      const colors = await colorThief.getColor(newTrack.album.images[0].url);
      return res.status(200).json({ track: newTrack, colors: colors.join(',') });
    }
  } catch (err) {
    if (err.statusCode === 401) {
      return res.status(401).json({ error: 'Unauthorized user, acess token not valid' });
    }
    return res.status(400).json({ error: err.message })
  }
});

router.patch('/set-liked', ensureAuthenticated, async (req, res) => {
  try {
    const { liked, id } = req.body;
    if (liked === 'true') {
      await trackController.updateLiked(id, true);
    } else {
      await trackController.updateLiked(id, false);
    }
    res.status(200).json({success: true, message: 'Track status updated'})
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({error: 'Unauthorized user, acess token not valid' });
     }
     return res.status(400).json({error: error.message})
   }
});

router.get('/liked', ensureAuthenticated, async (req, res) => {
  try {
    const myTracks = await trackController.getLikedTracks(req.user);
    res.status(200).json({ tracks: myTracks });
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({error: 'Unauthorized user, acess token not valid' });
    }
    return res.status(400).json({error: error.message})
  }
});

router.post('/add-to-spotify', ensureAuthenticated, async (req, res) => {
  const { spotifyId } = req.body;
  try {
    await trackController.addTrackToSpotify([spotifyId]);
    return res.status(200).json({success: true, message: 'Track added to liked songs playlist' });
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({ error: 'Unauthorized user, access token not valid' });
    }
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;