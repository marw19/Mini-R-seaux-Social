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
  private _userURL = `${environment.baseUrl}/users`;
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
