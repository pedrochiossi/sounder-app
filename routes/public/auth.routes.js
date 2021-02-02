require('dotenv').config();
const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../../controllers/user.controller');

router.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: [
      'user-read-email',
      'streaming',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-private',
      'user-library-read',
      'user-library-modify'
    ],
    showDialog: false,
  })
);

router.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: `${process.env.CLIENT_URL}/` }), (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/discovery`);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.status(200).json({success: true, message: 'Logout successfully'})
});

router.post('/auth/refresh', async (req, res) => {
  await userController.resetToken(req.user);
  return res.status(200).json({ success: true, message: 'Token refreshed successfully' });
});



module.exports = router;
