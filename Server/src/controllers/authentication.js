// jwt token handling for user authentication
const jwt = require("jsonwebtoken");
const User = require("../models/users.model.js");
const secret = process.env.SECRET;
// const { secret } = require('../config');
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Your Google Client ID
const client = new OAuth2Client(CLIENT_ID);


exports.login = async (req, res) => {
  try {
    const data = req.headers.authorization;
    const idtoken = data.split(" ")[1];

    if (!idtoken) {
      return res.status(403).json({ message: "No token provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: idtoken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    var user = await User.findOne({ email: payload.email });

    if (!user) {
      // Generate refresh token - you might want to use a more sophisticated method
      const refreshToken = jwt.sign(
        { email: payload.email }, 
        secret, 
        { expiresIn: '7d' }
      );

      // Create access token
      const accessToken = jwt.sign(
        { email: payload.email }, 
        secret, 
        { expiresIn: '24h' }
      );

      user = new User({
        googleId: payload.sub,  // Google's unique identifier
        email: payload.email,
        name: payload.name,
        accessToken: accessToken,
        refreshToken: refreshToken
      });

    } else {
      // Update existing user's tokens
      const accessToken = jwt.sign(
        { email: payload.email }, 
        secret, 
        { expiresIn: '24h' }
      );
      
      const refreshToken = jwt.sign(
        { email: payload.email }, 
        secret, 
        { expiresIn: '7d' }
      );

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
    }
    await user.save();

    return res.json({
      accessToken: user.accessToken,
      name: user.name
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ 
      message: "Internal server error",
      error: err.message 
    });
  }
};
exports.protected = (req, res) => {
  res.send("Protected route");
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.send("Logged out");
};

