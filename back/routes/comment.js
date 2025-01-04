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

    res.status(201).send({ message: "Commentaire ajouté avec succès.", comment: newComment });
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error.message);
    res.status(500).send({ message: "Erreur lors de l'ajout du commentaire", error: error.message });
  }
});

// Récupérer les commentaires d'un post spécifique
router.get("/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId).populate("comments");
    if (!post) {
      return res.status(404).send({ message: "Post non trouvé." });
    }

    const comments = await Comment.find({ postId })
      .populate("userId", "firstName lastName")
      .populate("replies");

    res.status(200).send({ comments });
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error.message);
    res.status(500).send({ message: "Erreur lors de la récupération des commentaires", error: error.message });
  }
});

module.exports = router;
