import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserService } from 'src/app/_services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any = {}; // Utilisateur connecté
  private subscriptions = new Subscription(); // Liste des abonnements

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les données utilisateur
    const userSubscription = this.authenticationService.currentUser.subscribe({
      next: (user) => {
        if (user) {
          this.user = { ...user };

          // Définir l'image par défaut si l'utilisateur est Admin
          if (this.user.role?.type === 'admin') {
            this.user.profileImageUrl = 'https://www.w3schools.com/w3css/img_avatar3.png';
          } else {
          }
        } else {
          this.user = null;
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      },
    });

    // S'abonner aux changements de l'image de profil
    const profileImageSubscription = this.userService.profileImage$.subscribe({
      next: (newImageUrl) => {
        if (this.user?.role?.type === 'rh' || this.user?.role?.type === 'candidat') {
          this.user.profileImageUrl = newImageUrl; // Met à jour la photo dans la navbar
        }
      },
    });

    this.subscriptions.add(userSubscription);
    this.subscriptions.add(profileImageSubscription);
  }



  logout(): void {
    if (this.user?.id) {
      const disconnectSubscription = this.userService.disconnetUser(this.user.id).subscribe({
        next: () => {
          this.authenticationService.logout();
          this.user = null;
        },
        error: (err) => {
          console.error('Erreur lors de la déconnexion:', err);
        },
      });

      this.subscriptions.add(disconnectSubscription);
    } else {
      this.authenticationService.logout();
      this.user = null;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
