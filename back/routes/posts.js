const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { verifyToken } = require('../config/verifyToken'); 

router.post('/', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).send({ message: 'Le contenu du post est requis.' });
    }

    // Vérifiez si req.user contient userId
    if (!req.user || !req.user.userId) {
      return res.status(400).send({ message: 'User ID manquant dans le token.' });
    }

    const userId = req.user.userId;

    const poste = new Post({
      userId, 
      content,
    });

    await poste.save();
    res.status(201).send({ message: 'Post créé avec succès', poste });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la création du post', error: error.message });
  }
});

router.get('/allPosts', verifyToken, async (req, res) => {
  try {
    // Récupérer tous les posts depuis la base de données
    const posts = await Post.find()
      .populate('userId', 'firstName lastName')
      .populate('comments') // Si vous voulez récupérer les informations des commentaires
      .sort({ createdAt: -1 }); // Trier les posts par date décroissante (les plus récents en premier)

    res.status(200).send({ posts });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la récupération des posts', error: error.message });
  }
});



module.exports = router;
