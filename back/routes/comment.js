const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Post = require("../models/post");
const { verifyToken } = require("../config/verifyToken");
const mongoose = require("mongoose");


// Ajouter un commentaire ou une réponse à un commentaire
router.post("/", verifyToken, async (req, res) => {
    try {
      const { postId, content, parentComment } = req.body;
  
      if (!content || content.trim().length === 0) {
        return res.status(400).send({ message: "Le contenu du commentaire est requis." });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Post non trouvé." });
      }
  
      const newComment = new Comment({
        userId: req.user.userId,
        content,
        postId,
        parentComment: parentComment || null,
      });
  
      await newComment.save();
  
      // Si c'est une réponse, ajoute-la aux réponses du commentaire parent
      if (parentComment) {
        const parent = await Comment.findById(parentComment);
        if (parent) {
          parent.replies.push(newComment._id);
          await parent.save();
        }
      }
  
      // Ajouter le commentaire à la liste des commentaires du post
      post.comments.push(newComment._id);
      await post.save();
  
      // Mettre à jour le nombre total de commentaires (commentaires + réponses)
      post.commentsCount = post.comments.length + post.comments.reduce((sum, comment) => sum + (comment.replies ? comment.replies.length : 0), 0);
      await post.save();
  
      res.status(201).send({
        message: "Commentaire ajouté avec succès.",
        comment: newComment,
        commentsCount: post.commentsCount,
      });
    } catch (error) {
      res.status(500).send({
        message: "Erreur lors de l'ajout du commentaire",
        error: error.message,
      });
    }
  });
  

// Récupérer les commentaires d'un post spécifique avec le nombre de commentaires
router.get("/:postId/comments", async (req, res) => {
    try {
      const postId = req.params.postId;
  
      // Trouver le post avec l'ID donné
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Post non trouvé." });
      }
  
      // Récupérer les commentaires du post, sans inclure les réponses (parentComment: { $exists: false })
      const comments = await Comment.find({ postId, parentComment: null })  // Récupérer uniquement les commentaires parents
        .populate("userId", "firstName lastName") // Peupler les informations de l'utilisateur
        .populate({
          path: "replies",  // Peupler les réponses pour chaque commentaire
          populate: {
            path: "userId", 
            select: "firstName lastName"
          }
        })
        .sort({ createdAt: -1 }) // Trier les commentaires par date de création, du plus récent au plus ancien
        .lean(); // Conversion en objet JavaScript natif pour plus de flexibilité
  
      const commentsCount = comments.length;
  
      // Envoyer la réponse avec les commentaires et leur nombre
      return res.status(200).json({ comments, commentsCount });
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error.message);
      return res.status(500).json({
        message: "Erreur lors de la récupération des commentaires",
        error: error.message,
      });
    }
  });
  
  

// Répondre à un commentaire
router.post("/:postId/comments/:commentId/reply", verifyToken, async (req, res) => {
    try {
      const { content } = req.body;
      const { postId, commentId } = req.params;
  
      if (!content || content.trim().length === 0) {
        return res.status(400).send({ message: "Le contenu de la réponse est requis." });
      }
  
      // Vérification de la validité des ID
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).send({ message: "ID du post invalide." });
      }
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).send({ message: "ID du commentaire invalide." });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Post non trouvé." });
      }
  
      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(404).send({ message: "Commentaire parent non trouvé." });
      }
  
      const newReply = new Comment({
        userId: req.user.userId,
        content,
        postId,
        parentComment: commentId,
      });
  
      await newReply.save();
  
      parentComment.replies.push(newReply._id);
      await parentComment.save();
  
      post.comments.push(newReply._id);
      await post.save();
  
      // Mettre à jour le nombre total de commentaires (commentaires + réponses)
      post.commentsCount = post.comments.length + post.comments.reduce((sum, comment) => sum + (comment.replies ? comment.replies.length : 0), 0);
      await post.save();
  
      res.status(201).send({
        message: "Réponse ajoutée avec succès.",
        reply: newReply,
        commentsCount: post.commentsCount,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse :", error.message);
      res.status(500).send({
        message: "Erreur lors de l'ajout de la réponse.",
        error: error.message,
      });
    }
  });
  
  

  // Récupérer les réponses d'un commentaire spécifique
router.get("/:postId/comments/:commentId/replies", async (req, res) => {
    try {
      const { postId, commentId } = req.params;
  
      // Vérifier si le post existe
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Post non trouvé." });
      }
  
      // Vérifier si le commentaire parent existe
      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(404).send({ message: "Commentaire parent non trouvé." });
      }
  
      // Récupérer uniquement les réponses liées à ce commentaire
      const replies = await Comment.find({ parentComment: commentId })
        .populate("userId", "firstName lastName") // Populate user info
        .sort({ createdAt: -1 }); // Optionnel : Trier les réponses par date de création
  
      // Envoyer la réponse avec les réponses du commentaire
      res.status(200).json({ replies });
    } catch (error) {
      console.error("Erreur lors de la récupération des réponses :", error.message);
      res.status(500).send({
        message: "Erreur lors de la récupération des réponses.",
        error: error.message,
      });
    }
  });
  
  
  

module.exports = router;
