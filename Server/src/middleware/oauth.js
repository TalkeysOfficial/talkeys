const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const secret = process.env.SECRET;

exports.verifyToken = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (req.originalUrl.startsWith("/api/payment/callback")) {
    console.log("[AUTH MIDDLEWARE] Skipping token check for payment callback");
    return next();
  }
		console.log(token);
		if (!token) {
			return res.status(403).json({ message: "No token provided" });
		}
		

		jwt.verify(token, secret, async (err, decoded) => {
			if (err) {
				return res
					.status(401)
					.json({ message: "Failed to authenticate token" });
			}
			console.log(decoded.email);
			req.user = await User.findOne({ email: decoded.email });
			next();
		});
	} catch (error) {
		return res.status(500).json({ message: "User Not Verified" });
	}
};
