const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/discovery');
    return;
  }
  res.render('public/index');
});

module.exports = router;
