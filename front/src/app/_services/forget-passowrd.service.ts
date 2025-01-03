import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class ForgetPassowrdService {
  private _forgetPassword=`${environment.baseUrl}/forget-password` 
  constructor(private http: HttpClient) { }

  sendMail(email):Observable<Object> {
    return this.http.post(`${this._forgetPassword}/request-password-reset`,email);
  }
  
  updatePassword(token: string, user: { newPassword: string; confirmPassword: string }): Observable<Object> {
    return this.http.put(`${this._forgetPassword}/reset-password/${token}`, user);
  }
  

  verifCodeSended(token: string, user): Observable<Object> {
    console.log('Données envoyées :', user); // Ajoutez ce log pour vérifier
    return this.http.post(`${this._forgetPassword}/verify-code/${token}`, user);
}
}
