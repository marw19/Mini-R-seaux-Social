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

        } else {
          this.user = null;
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      },
    });

   

    this.subscriptions.add(userSubscription);;
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
