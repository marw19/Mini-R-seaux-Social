import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Si l'utilisateur n'est pas connecté, autoriser l'accès à la page de connexion
    if (!this.authenticationService.loggedIn()) {
      return of(true);
    }

    // Si l'utilisateur est connecté, récupérez les détails
    const userId = this.authenticationService.currentUserValue?._id;
    if (!userId) {
      return of(this.router.createUrlTree(['/connexion']));
    }

    return this.userService.getUserrById(userId).pipe(
      map((user) => {
        // Rediriger en fonction du rôle
        this.redirectBasedOnRole(user.role?.type);
        return false; // Bloque l'accès à la page de connexion
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
        return of(this.router.createUrlTree(['/connexion'])); // Redirection en cas d'erreur
      })
    );
  }

  /**
   * Redirige l'utilisateur en fonction de son rôle
   * @param role Rôle de l'utilisateur
   */
  private redirectBasedOnRole(role: string | undefined): void {
    const currentUrl = this.router.url; // URL actuelle
    switch (role) {
      case 'admin':
        if (currentUrl !== '/admin') {
          this.router.navigate(['/admin']);
        }
        break;
      case 'candidat':
        if (currentUrl !== '/candidat') {
          this.router.navigate(['/candidat']);
        }
        break;
      case 'rh':
        if (currentUrl !== '/rh') {
          this.router.navigate(['/rh']);
        }
        break;
      default:
        if (currentUrl !== '/connexion') {
          this.router.navigate(['/connexion']);
        }
    }
  }
}
