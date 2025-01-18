
function checkRole(req, res, next) {
    const role = req.user.role; 

    if (role === 'user' || role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: 'Forbidden: Invalid role' }); // Role is not valid, send a 403 Forbidden response
    }
}

module.exports = checkRole;