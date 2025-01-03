const jwt = require('jsonwebtoken');

exports.verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit : rôle non autorisé' });
        }
        next();
    };
};
