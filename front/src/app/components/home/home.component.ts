import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from 'src/app/_services/post.service';
import iziToast from 'izitoast';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: any[] = [];
  content: string = '';
  currentModal: any;

  constructor(private postService: PostService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(
      (response) => {
        // Ajoute un champ 'isExpanded' pour chaque post
        this.posts = response.posts.map(post => ({
          ...post,
          isExpanded: false 
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des posts', error);
      }
    );
  }

  toggleExpand(post: any): void {
    // Inverse l'état 'isExpanded' pour afficher ou cacher le texte complet
    post.isExpanded = !post.isExpanded;
  }

  addPost(): void {
    
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
        if (this.currentModal) {
          this.currentModal.close();
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
   // Vérifie si le texte doit être tronqué
   isTruncated(content: string): boolean {
    return content.length > 3000;
  }

  // Bascule l'état du texte entre tronqué et complet
  toggleTruncate(post: any): void {
    post.isTruncated = !post.isTruncated;
  }

}
