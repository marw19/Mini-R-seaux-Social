import {
  HttpInterceptor,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { Ng2IzitoastService } from 'ng2-izitoast';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private router: Router,
    private iziToast: Ng2IzitoastService // Importation du service Ng2IziToast
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthenticationService);
    const token = authService.getToken();

    // Ajouter l'en-tête Authorization si le token existe
    const tokenizedReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    return next.handle(tokenizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur interceptée :', {
          status: error.status,
          message: error.message,
          error: error.error,
        });

        let errorMessage = 'Une erreur est survenue.';

        // Gestion des erreurs HTTP spécifiques
        switch (error.status) {
          case 401: // Unauthorized
            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            authService.logout(); // Déconnexion
            this.router.navigate(['/connexion']);
            break;

          case 403: // Forbidden
            errorMessage = 'Vous n’avez pas les autorisations nécessaires.';
            break;

          case 404: // Not Found
            errorMessage = 'La ressource demandée est introuvable.';
            break;

          case 500: // Internal Server Error
          case 503: // Service Unavailable
            errorMessage = 'Une erreur serveur est survenue. Veuillez réessayer plus tard.';
            break;

          default: // Autres cas
            errorMessage = error.error?.message || 'Une erreur est survenue.';
        }

        // Afficher le message d'erreur dans un toaster
        this.iziToast.show({
          title: 'Erreur',
          message: errorMessage,
          backgroundColor: '#f8d7da',
          titleColor: '#721c24',
          messageColor: '#721c24',
          progressBarColor: '#721c24',
          position: 'topRight',
          timeout: 5000,
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
