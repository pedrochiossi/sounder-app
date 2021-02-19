require('dotenv').config();
const express = require('express');
const passport = require('passport');
const url = require('url');
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
    const { access_token } = req.user;
    res.redirect(url.format({
      pathname: `${process.env.CLIENT_URL}/`,
      query: {
        redirected: true
      }
    }))
});

router.get('/logout', (req, res) => {
  req.logOut();
  req.session.destroy();
  res.clearCookie('connect.sid', { path: '/' });
  res.status(200).json({success: true, message: 'Logout successfully'})
});

router.post('/auth/refresh', async (req, res, next) => {
  try {
    await userController.resetToken(req.user);
    return res.status(200).json({ success: true, message: 'Token refreshed successfully' });
  } catch(error) {
    next(error);
  }
});



module.exports = router;
