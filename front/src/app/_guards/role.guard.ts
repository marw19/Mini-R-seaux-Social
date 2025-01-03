import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private tokenStorage: TokenStorageService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.tokenStorage.getUser();

    // Check if user exists and has the 'utilisateur' role
    if (user && user.role?.type === 'utilisateur') {
      return true;
    }

    // Redirect to login or another page if unauthorized
    this.router.navigate(['/connexion']);
    return false;
  }
}
