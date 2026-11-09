// jwt token handling for user authentication
const jwt = require("jsonwebtoken");
const User = require("./users.model.js");
const secret = process.env.SECRET;
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Your Google Client ID
const client = new OAuth2Client(CLIENT_ID);

exports.login = async (req, res) => {
  try {
    const data = req.headers.authorization;

    if (!data || !data.startsWith("Bearer ")) {
      return res.status(403).json({ message: "No token provided" });
    }

    const idtoken = data.split(" ")[1];

    if (!idtoken) {
      return res.status(403).json({ message: "No token provided" });
    }

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: idtoken,
        audience: CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    if (!payload?.email || payload.email_verified !== true) {
      return res.status(401).json({ message: "Google email is not verified" });
    }

    var user = await User.findOne({ email: payload.email });

    if (!user) {
      // Generate refresh token - you might want to use a more sophisticated method
      const refreshToken = jwt.sign({ email: payload.email }, secret, {
        expiresIn: "7d",
      });

      // Create access token
      const accessToken = jwt.sign({ email: payload.email }, secret, {
        expiresIn: "4d",
      });

      user = new User({
        googleId: payload.sub, // Google's unique identifier
        email: payload.email,
        name: payload.name,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      // Update existing user's tokens
      const accessToken = jwt.sign({ email: payload.email }, secret, {
        expiresIn: "4d",
      });

      const refreshToken = jwt.sign({ email: payload.email }, secret, {
        expiresIn: "7d",
      });

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
    }
    await user.save();

    return res.json({
      accessToken: user.accessToken,
      name: user.name,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.send("Logged out");
};
