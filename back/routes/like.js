const express = require('express');
const router = express.Router();
const Like = require('../models/like');
const Post = require('../models/post');
const { verifyToken } = require('../config/verifyToken');

// Ajouter ou supprimer un like d'un post
router.post('/like', verifyToken, async (req, res) => {
    try {
      const { postId } = req.body;
  
      if (!postId) {
        return res.status(400).send({ message: "L'ID du post est requis." });
      }
  
      // Vérifiez si l'utilisateur a déjà liké ce post
      const existingLike = await Like.findOne({
        userId: req.user.userId, // L'ID de l'utilisateur dans le token
        postId: postId,          // L'ID du post
      });
  
      // Vérifiez si le post existe
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post non trouvé.' });
      }
  
      console.log('Post avant modification:', post.likesCount); // Log avant modification
  
      if (existingLike) {
        // Si l'utilisateur a déjà liké ce post, on le supprime (Dislike)
        await Like.findOneAndDelete({
          userId: req.user.userId,
          postId: postId,
        });
  
        // Décrémentez le nombre de likes du post
        post.likesCount -= 1;
        await post.save();
  
        console.log('Post après suppression du like:', post.likesCount); // Log après modification
  
        return res.status(200).send({ message: 'Like supprimé avec succès.', likesCount: post.likesCount });
      } else {
        // Si l'utilisateur n'a pas encore liké ce post, on ajoute un like
        const newLike = new Like({
          userId: req.user.userId,
          postId: postId,
        });
  
        await newLike.save();
  
        // Incrémentez le nombre de likes du post
        post.likesCount += 1;
        await post.save();
  
        console.log('Post après ajout du like:', post.likesCount); // Log après modification
  
        return res.status(201).send({ message: 'Like ajouté avec succès.', likesCount: post.likesCount });
      }
    } catch (error) {
      console.error('Erreur lors du traitement du like:', error.message);
      res.status(500).send({ message: 'Erreur lors du traitement du like', error: error.message });
    }
  });
  
module.exports = router;
