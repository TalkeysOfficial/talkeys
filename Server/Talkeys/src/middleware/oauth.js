const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token)
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        console.log("L")
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Failed to authenticate token" });
            }
            req.user = decoded;
            console.log(decoded)
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};