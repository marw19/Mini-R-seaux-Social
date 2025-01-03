const router = require('express').Router();
const lodash = require('lodash');
const User = require('../models/user');
const Role = require('../models/role'); 
const bcrypt = require('bcryptjs')
var verif = require('../config/verifyToken')
const fs = require('fs');
var generator = require('generate-password');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const handlebars = require('handlebars');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, 
    },
});

router.get('/stayConnected/:email',async (req,res)=>{
    let user = await User.findOne({email:req.params.email});
    if(!user)
        return res.send('User Id is not found') 
    if(user.StayConnected == false)
    user.StayConnected =true
    else
    user.StayConnected =false
    try {
        user = await user.save();
    } catch (error) {
        res.send("Save in DB Error"+ error.message)
    }
    res.send(user)
});

router.get('/:id',verif.verifyToken,async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.send('User Id is not found')
    user= JSON.stringify(user, ["email", "role","_id","StayConnected","token","firstName",'lastName','phone'])  
    res.send(user)

});

router.post('/signUp', async (req, res) => {
  try {
      // Génération du mot de passe
      const plainPassword = generator.generate({
          length: 10,
          numbers: true,
      });
      console.log("Mot de passe généré avant cryptage :", plainPassword);

      // Cryptage du mot de passe
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Récupération du rôle par défaut ("utilisateur")
      const defaultRole = await Role.findOne({ type: 'utilisateur' });
      if (!defaultRole) {
          return res.status(404).send("Rôle 'utilisateur' non trouvé");
      }

      // Création de l'utilisateur
      const user = new User({
          ...lodash.pick(req.body, ['email', 'firstName', 'lastName', 'phone']),
          password: hashedPassword,
          role: defaultRole._id, // ObjectId du rôle
      });

      // Enregistrement de l'utilisateur
      await user.save();

      // Lecture et compilation du template HTML
      const templatePath = 'templatesMails/password.html'; // Chemin du fichier HTML
      const template = handlebars.compile(fs.readFileSync(templatePath, 'utf-8'));
      const htmlToSend = template({
          firstName: req.body.firstName || 'Utilisateur', // Remplace par le prénom ou un fallback
          email: req.body.email,
          password: plainPassword, // Le mot de passe en clair
      });

      // Envoi de l'email
      await transporter.sendMail({
          from: process.env.MAIL_FROM,
          to: req.body.email,
          subject: 'Bienvenue sur notre plateforme',
          html: htmlToSend,
      });

      // Réponse à l'utilisateur
      res.status(201).send({ message: 'Utilisateur créé avec succès et email envoyé', user });
  } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      res.status(500).send({ message: 'Erreur interne', error: error.message });
  }
});


router.put('/:id',verif.verifyToken,async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.send('user Id is not found')
        user=lodash.merge(user,req.body)
        user = await user.save();  
        res.send(user)
})

router.get('/disconenct/:id',verif.verifyToken,async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.send('User Id is not found')
    user.token = ""
    user.StayConnected = false
    user = await user.save();
    res.send({message:'ok'})

});


module.exports = router;