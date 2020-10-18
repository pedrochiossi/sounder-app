const qs = require('qs');
const axios = require('axios');
const User = require('../models/User');

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

module.exports = {

  async resetToken(user) {
    const data = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: user.refresh_token,
      client_id: process.env.APPKEY,
      client_secret: process.env.APPSECRET,
    });
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    try {
      const response = await axios.post(TOKEN_URL, data, headers);
      await User.findOneAndUpdate({ _id: user._id }, { access_token: response.data.access_token });
    } catch (error) {
      throw error;
    }
  },
};
