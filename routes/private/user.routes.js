const express = require('express');
const router = express.Router();
const AppError = require('../../errors/AppError');


router.get('/', async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);
  }
  const error = new AppError('Unauthorized', 403);
  return next(error);
})

module.exports = router;
