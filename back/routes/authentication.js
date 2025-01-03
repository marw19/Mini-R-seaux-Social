const router = require('express').Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
    try {
        // Recherche de l'utilisateur par email et chargement du rôle
        const userIB = await User.findOne({ email: req.body.email }).populate('role');

        if (!userIB) {
            return res.status(401).send({ message: 'Email invalide' });
        }

        // Vérifiez si le compte est désactivé
        if (userIB.status === false) {
            return res.status(403).send({ message: 'Votre compte est désactivé. Veuillez contacter un administrateur.' });
        }

        // Vérification du mot de passe
        const compare = await bcrypt.compare(req.body.password, userIB.password);
        if (!compare) {
            return res.status(401).send({ message: 'Mot de passe invalide' });
        }

        // Ajouter le rôle et ID utilisateur au payload pour le token JWT
        const payload = { userId: userIB._id, role: userIB.role.type };

        // Génération du token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '16h' });

        // Mettre à jour le token dans la base de données si StayConnected est activé
        if (userIB.StayConnected) {
            userIB.token = token;
        } else {
            userIB.token = ''; // Réinitialiser le token
        }
        await userIB.save();

        
    

        // Filtrer les informations utilisateur à renvoyer
        const filteredUser = _.pick(userIB, [
            'email',
            'role',
            'firstName',
            'lastName',
            '_id',
            'token',
        ]);

        res.status(200).send({ user: filteredUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erreur interne du serveur' });
    }
});



module.exports = router;
