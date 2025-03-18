exports.checkRole = (roles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;

            if (roles.includes(userRole)) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden: Invalid role' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};