const User = require('../models/User');


const findOrCreateUser = async (req, res) => {
  const spotifyId = req.user.id;
  const name = req.user.displayName;
  const imageURL = req.user.photos[0];
  const email = req.user.emails[0].value;

  const user = await User.findOne({ spotifyId });
  if (user) {
    res.redirect('/private/discovery/');
    return;
  }

  try {
    User.create({ spotifyId, name, imageURL, email });
    res.redirect('/private/discovery/');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  findOrCreateUser,
}