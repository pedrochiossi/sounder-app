const express = require('express');

const router = express.Router();
const trackController = require('../../controllers/track.controller');

router.get('/discovery', async (req, res) => {
  const { user } = req;
  trackController.addAccessToken(user);
  try {
    const total = await trackController.getTotal();
    const randomId = await trackController.getRandomTrackId(total);
    const recommendation = await trackController.getRandomRecommendation(randomId);
    await trackController.saveTrack(recommendation, req.user);
    res.render('private/discovery/index', recommendation);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
