// jwt token handling for user authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users.model.js');
// const { secret } = require('../config');

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Your Google Client ID
const client = new OAuth2Client(CLIENT_ID);

exports.verifyIdToken = async (idToken, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID, // Ensure this matches your Client ID
    });
    const payload = ticket.getPayload();
    console.log('User Info:', payload);
    res.user = payload;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}


exports.protected = (req,res) => {
    res.send('Protected route');
}



exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.send('Logged out');
}