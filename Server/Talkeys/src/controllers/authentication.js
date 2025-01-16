// jwt token handling for user authentication
const jwt = require("jsonwebtoken");
const User = require("../models/users.model.js");
const secret = process.env.SECRET;
// const { secret } = require('../config');
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Your Google Client ID
const client = new OAuth2Client(CLIENT_ID);

exports.verifyToken = async (req, res, next) => {
  try {
    const data = req.headers.authorization;
    const idtoken = data.split(" ")[1];
    // console.log("Token:", idtoken);

    if (!idtoken) {
      return res.status(403).json({ message: "No token provided" });
    }
    const ticket = await client.verifyIdToken({
      idToken: idtoken,
      audience: CLIENT_ID, // Verify the token is intended for this client
    });
    console.log("Ticket:");
    const payload=ticket.getPayload();
    // console.log("Payload:", payload);
    // var user=await User.findOne({email:payload.email});
    // if(!user){
    //   var user = new User({
    //     email: payload.email,
    //     name: payload.name,
    //     picture: payload.picture
    //   });
    //   await user.save();
    // }
    // user.accessToken=jwt.sign({email:payload.email},secret,{expiresIn:86400});
    const accessToken=jwt.sign({email:payload.email},secret,{expiresIn:86400});
    res.json(accessToken);
  } catch (err) {
    console.log(err);
  }
};

exports.protected = (req, res) => {
  res.send("Protected route");
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.send("Logged out");
};
