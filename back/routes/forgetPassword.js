const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, 
    },
});

/* API to request password reset */
router.post('/request-password-reset', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: 'Email invalide' });
        }
  
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
        const code = crypto.randomInt(10000, 99999).toString(); // Code à 5 chiffres
  
        user.codeWithForgetPassword = code;
        user.token = token;
        await user.save();
  
        // Lecture du template HTML
        const template = handlebars.compile(fs.readFileSync('templatesMails/resetPassword.html', 'utf-8'));
        const htmlToSend = template({
            codeNumber1: code[0],
            codeNumber2: code[1],
            codeNumber3: code[2],
            codeNumber4: code[3],
            codeNumber5: code[4],
            token,
            url: `${process.env.CLIENT_URL}/${token}`,
        });
  
        // Envoi de l'email
        await transporter.sendMail({
            from: process.env.MAIL_FROM, // Votre adresse email Gmail
            to: user.email,
            subject: 'Mot de passe oublié',
            html: htmlToSend,
        });
  
        res.status(200).send({ message: 'Code de vérification envoyé', token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erreur interne', error: error.message });
    }
  });


/* API to reset password */
router.put('/reset-password/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId, token });

        if (!user) {
            return res.status(404).send({ message: 'Utilisateur non trouvé ou token invalide' });
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).send({ message: 'Les mots de passe ne correspondent pas' });
        }

        user.password = await bcrypt.hash(req.body.newPassword, 10);
        user.token = ''; // Invalider le token après réinitialisation
        user.codeWithForgetPassword = '';
        await user.save();

        res.status(200).send({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erreur interne', error: error.message });
    }
});

/* API to verify the code sent */
router.post('/verify-code/:token', async (req, res) => {
    console.log('Requête reçue pour vérifier le code :', req.body);
    console.log('Token reçu :', req.params.token);

    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId, token: req.params.token });

        if (!user) {
            console.log('Utilisateur non trouvé ou token invalide');
            return res.status(404).send({ message: 'Utilisateur non trouvé ou token invalide' });
        }

        if (req.body.code !== user.codeWithForgetPassword) {
            console.log('Code incorrect:', req.body.code, 'attendu:', user.codeWithForgetPassword);
            return res.status(400).send({ message: 'Code incorrect' });
        }

        console.log('Code validé avec succès');
        user.codeWithForgetPassword = ''; // Supprimer le code après validation
        await user.save();

        // Réponse 200 avec un message de succès
        return res.status(200).send({ message: 'Code vérifié avec succès' });
    } catch (error) {
        console.error('Erreur lors de la validation du code:', error);
        return res.status(500).send({ message: 'Erreur interne', error: error.message });
    }
});

module.exports = router;
