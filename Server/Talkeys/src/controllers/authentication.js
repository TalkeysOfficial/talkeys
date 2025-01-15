// jwt token handling for user authentication
const jwt = require('jsonwebtoken');
const User = require('../models/users.model.js');
const secret = process.env.SECRET;
// const { secret } = require('../config');

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Your Google Client ID
const client = new OAuth2Client(CLIENT_ID);
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the 'Authorization' header
  console.log('Token:', token);
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  console.log('Secret:', secret);
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; 
    next(); 
  });
};


exports.protected = (req,res) => {
    res.send('Protected route');
}



exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.send('Logged out');
}