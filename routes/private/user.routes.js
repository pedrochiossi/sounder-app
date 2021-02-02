const express = require('express');
const router = express.Router();
const AppError = require('../../errors/AppError');


router.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);
  }
  throw new AppError('Unauthorized', 403);
})

module.exports = router;
