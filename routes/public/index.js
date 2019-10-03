const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/discovery');
  }
  res.render('public/index');
});

module.exports = router;