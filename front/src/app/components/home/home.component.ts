import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from 'src/app/_services/post.service';
import iziToast from 'izitoast';
import { LikesService } from 'src/app/_services/likes.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CommentService } from 'src/app/_services/comment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: any[] = [];
  comments: any[] = [];
  content: string = '';
  currentModal: any;

  constructor(
    private postService: PostService,
    private likeService: LikesService ,
    private authService: AuthenticationService,
    private commentService: CommentService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(
      (response) => {
        // Récupérer l'ID de l'utilisateur connecté
        const currentUserId = this.getCurrentUserId(); // Par exemple, depuis un service d'authentification
        
        // Ajoute un champ 'isExpanded' et 'isLiked' pour chaque post
        this.posts = response.posts.map(post => ({
          ...post,
          isExpanded: false,
          isCommenting: false,
          commentText: '',
          comments: [],
          isLiked: post.likes && post.likes.includes(currentUserId) // Vérifier si l'utilisateur a liké ce post
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des posts', error);
      }
    );
  }

  loadComments(post: any): void {
    this.commentService.getComments(post._id).subscribe(
      (response) => {
        post.comments = response.comments || [];
        post.commentsCount = post.comments.length || 0;
      },
      (error) => {
        console.error('Erreur lors de la récupération des commentaires', error);
      }
    );
  }
  
  
  
  getCurrentUserId(): string {
    return this.authService.getCurrentUserId();
  }

  toggleExpand(post: any): void {
    // Inverse l'état 'isExpanded' pour afficher ou cacher le texte complet
    post.isExpanded = !post.isExpanded;
  }

  toggleCommentBox(post: any): void {
    // Si on clique pour afficher/masquer les commentaires
    post.areCommentsVisible = !post.areCommentsVisible;
  
    // Si on ouvre le champ de commentaire, on charge les commentaires
    if (!post.isCommenting) {
      post.isCommenting = true;
      this.loadComments(post);
    }
  }
  
  

  onCommentInput(post: any): void {
    // Toggle the "Publier" button visibility based on content length
    post.isCommenting = post.commentText.length > 0;
  }

  addPost(modal?: any): void {
    if (this.content.length > 3000) {
      iziToast.error({
        title: 'Erreur',
        message: 'Le contenu du post ne peut pas dépasser 3000 caractères.',
        position: 'topRight',
      });
      return;
    }
  
    if (this.content.trim() === '') {
      iziToast.error({
        title: 'Erreur',
        message: 'Le contenu du post ne peut pas être vide.',
        position: 'topRight',
      });
      return;
    }
  
    this.postService.addPost(this.content).subscribe(
      (response) => {
        // Afficher un toast de succès
        iziToast.success({
          title: 'Succès',
          message: 'Post ajouté avec succès',
          position: 'topRight',
        });
  
        // Recharge les posts après l'ajout
        this.loadPosts();
        this.content = ''; // Réinitialiser le contenu du post
  
        // Fermer le modal après l'ajout
        if (modal) {
          modal.close();
        }
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du post', error);
        // Afficher un toast d'erreur
        iziToast.error({
          title: 'Erreur',
          message: 'Erreur lors de l\'ajout du post',
          position: 'topRight',
        });
      }
    );
  }
  
  addComment(post: any): void {
    const commentContent = post.commentText;
    if (commentContent.trim()) {
      this.commentService.addComment(post._id, commentContent).subscribe(
        (response) => {
          iziToast.success({
            title: 'Succès',
            message: 'Commentaire ajouté avec succès.',
            position: 'topRight',
          });
          post.commentText = ''; // Réinitialiser le champ de saisie du commentaire
          post.isCommenting = false; // Masquer le champ de commentaire
  
          // Ajouter le commentaire directement dans le tableau des commentaires du post
          const newComment = {
            userId: {
              firstName: this.authService.getCurrentUserFirstName(),
              lastName: this.authService.getCurrentUserLastName(),
            },
            content: commentContent,
            createdAt: new Date().toISOString(),
          };
          post.comments.unshift(newComment); // Ajoute le commentaire en haut de la liste
          post.commentsCount = post.comments.length; // Mettre à jour le nombre de commentaires
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du commentaire', error);
          iziToast.error({
            title: 'Erreur',
            message: 'Erreur lors de l\'ajout du commentaire.',
            position: 'topRight',
          });
        }
      );
    }
  }
  

  openPostModal(postModal: TemplateRef<any>): void {
    this.currentModal = this.modalService.open(postModal, {
      ariaLabelledBy: 'postModalLabel',
    });
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    // Réinitialiser la hauteur pour recalculer
    textarea.style.height = 'auto';
    // Ajuster la hauteur en fonction du contenu
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  // Fonction pour liker un post
  likePost(post: any): void {
    const postId = post._id;
    
    // Appel du service pour toggle le like
    this.likeService.toggleLike(postId).subscribe(
      (response) => {
        // Mettre à jour l'état du post avec la réponse du backend
        post.isLiked = response.isLiked; // Si true, le like est activé, sinon désactivé
        post.likesCount = response.likesCount; // Mettre à jour le nombre de likes
      },
      (error) => {
        console.error('Erreur lors du like du post', error);
        iziToast.error({
          title: 'Erreur',
          message: 'Erreur lors du like du post',
          position: 'topRight',
        });
      }
    );
  }
  
  // Vérifie si le texte doit être tronqué
  isTruncated(content: string): boolean {
    return content.length > 3000;
  }

  // Bascule l'état du texte entre tronqué et complet
  toggleTruncate(post: any): void {
    post.isTruncated = !post.isTruncated;
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const commentDate = new Date(date);
    const timeDiff = Math.abs(now.getTime() - commentDate.getTime());
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} jour${days > 1 ? 's' : ''} passé`;
    } else if (hours > 0) {
      return `${hours} heure${hours > 1 ? 's' : ''} passé`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} passé`;
    } else {
      return `${seconds} seconde${seconds > 1 ? 's' : ''} passé`;
    }
  }

  
}
