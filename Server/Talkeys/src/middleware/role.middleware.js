exports.checkRole = (req, res, next) => {
    try {
        const role = req.user.role;

        if (role === 'user' || role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Invalid role' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}