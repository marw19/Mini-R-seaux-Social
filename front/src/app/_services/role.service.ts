import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private userRole: string = '';
  constructor() { }
  setRole(role: string): void {
    this.userRole = role;
  }
  getRole(): string {
    return this.userRole;
  }
  isUtilisateur(): boolean {
    return this.userRole === 'utilisateur';
  }
}
