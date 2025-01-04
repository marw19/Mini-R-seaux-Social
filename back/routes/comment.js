const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Post = require("../models/post");
const { verifyToken } = require("../config/verifyToken");

// Ajouter un commentaire ou une réponse à un commentaire
router.post("/", verifyToken, async (req, res) => {
    try {
      const { postId, content, parentComment } = req.body;
  
      if (!content || content.trim().length === 0) {
        return res.status(400).send({ message: "Le contenu du commentaire est requis." });
      }
  
      // Use async/await instead of callbacks
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
  
      // Mettre à jour le nombre de commentaires du post
      post.commentsCount = post.comments.length;
      await post.save();
  
      // Send the response after all operations are complete
      res.status(201).send({ 
        message: "Commentaire ajouté avec succès.", 
        comment: newComment,
        commentsCount: post.commentsCount  // Retourner le nombre de commentaires mis à jour
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error.message);
      res.status(500).send({ message: "Erreur lors de l'ajout du commentaire", error: error.message });
    }
  });
  
  

// Récupérer les commentaires d'un post spécifique avec le nombre de commentaires
router.get("/:postId/comments", async (req, res) => {
    try {
      const postId = req.params.postId;
  
      // Find the post with the given postId
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Post non trouvé." });
      }
  
      // Fetch and sort comments for the post by createdAt in descending order
      const comments = await Comment.find({ postId })
        .populate("userId", "firstName lastName") // Populate user info (first and last name)
        .populate("replies") // Populate replies if any
        .sort({ createdAt: -1 }); // Sort comments by creation time in descending order
  
      const commentsCount = comments.length;
  
      // Send the response with the comments and the count
      return res.status(200).json({ comments, commentsCount });
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error.message);
  
      // Check if headers have already been sent before responding with an error
      if (!res.headersSent) {
        return res.status(500).json({
          message: "Erreur lors de la récupération des commentaires",
          error: error.message,
        });
      } else {
        console.error("Headers already sent. Skipping error response.");
      }
    }
  });
  
  
module.exports = router;
