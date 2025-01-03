import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../_models/user";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "http://api.geonames.org";
  private _userURL = `${environment.baseUrl}/users`;
  private profileImageSubject = new BehaviorSubject<string>(
    'https://www.w3schools.com/w3css/img_avatar3.png' // Image par défaut
  );
  profileImage$ = this.profileImageSubject.asObservable();

  
  constructor(private http: HttpClient) {}
  stayConnected(email: string): Observable<User> {
    return this.http.get<User>(`${this._userURL}/stayConnected/${email}`);
  }

  getUserrById(id: string): Observable<User> {
    return this.http.get<User>(`${this._userURL}/${id}`);
  }

  disconnetUser(id: string): Observable<User> {
    return this.http.get<User>(`${this._userURL}/disconenct/${id}`);
  }
  signUp(user: any): Observable<any> {
    return this.http.post(`${this._userURL}/signUp`, user);
  }

 
}
