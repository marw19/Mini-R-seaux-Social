const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Requête non autorisée : token manquant ou mal formé' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // Ajouter les données utilisateur décodées à la requête
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Token expiré' });
        } else {
            return res.status(401).send({ message: 'Token invalide' });
        }
    }
};
