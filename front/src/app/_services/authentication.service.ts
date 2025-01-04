import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private readonly _authenticationURL = `${environment.baseUrl}/authentication`;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
    const storedUser = this.tokenStorageService.getUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Retourne l'utilisateur courant
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getCurrentUserId(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser._id : null; // Retourne l'ID de l'utilisateur ou null si aucun utilisateur
  }
  public getCurrentUserFirstName(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.firstName : null; // Retourne le prénom ou null si aucun utilisateur
  }
  
  // Récupérer le nom de famille de l'utilisateur
  public getCurrentUserLastName(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.lastName : null; // Retourne le nom de famille ou null si aucun utilisateur
  }
  // Connexion utilisateur
  loginUser(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this._authenticationURL}/login`, user).pipe(
      map((response: any) => {
        
  
        if (response?.token && response?.user) {
          // Sauvegarder le token et les informations utilisateur
          this.tokenStorageService.saveToken(response.token);
          this.tokenStorageService.saveUser(response.user);
          this.currentUserSubject.next(response.user);
        } else {
          throw new Error("Réponse inattendue de l'API.");
        }
  
        return response;
      }),
      catchError(this.handleError) // Appelle la gestion centralisée des erreurs
    );
  }
  

  // Déconnexion utilisateur
  logout(): void {
    this.tokenStorageService.removeToken();
    this.tokenStorageService.removeUser();
    this.currentUserSubject.next(null);
    this.router.navigate(['/connexion']);
  }

  // Vérification si utilisateur connecté
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Récupérer le token
  getToken(): string | null {
    return this.tokenStorageService.getToken();
  }

  // Vérification si le token est expiré
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
      return payload.exp < now; // Expiration dépassée
    } catch (e) {
      console.error('Erreur lors de la vérification du token :', e);
      return true; // Considérer le token expiré en cas d'erreur
    }
  }

  // Gestion centralisée des erreurs
  private handleError(error: any): Observable<never> {
    const errorMessage = error.error?.message || 'Erreur de connexion.';
    console.error('Erreur API :', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
