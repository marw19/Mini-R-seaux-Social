import { Injectable } from '@angular/core';

// Clés pour stocker le token et l'utilisateur
const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  // Enregistre le token
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  // Récupère le token
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  // Supprime le token
  public removeToken(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  // Enregistre les informations utilisateur
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Récupère les informations utilisateur
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  // Supprime les informations utilisateur
  public removeUser(): void {
    window.sessionStorage.removeItem(USER_KEY);
  }

  // Supprime tout (utilisateur et token)
  public clear(): void {
    this.removeToken();
    this.removeUser();
  }
}
