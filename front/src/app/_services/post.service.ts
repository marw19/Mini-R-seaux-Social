import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

   private _postURL = `${environment.baseUrl}/posts`;

  constructor(private http: HttpClient) { }

   // Méthode pour récupérer tous les posts
   getPosts(): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this._postURL}/allPosts`, { headers }); // Envoi de la requête GET
  }

  // Méthode pour ajouter un post
  addPost(content: string): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const postData = { content }; 

    return this.http.post<any>(this._postURL, postData, { headers });
  }
}
