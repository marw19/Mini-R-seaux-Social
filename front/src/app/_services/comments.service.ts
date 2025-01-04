import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommentsService {
  private _commentURL = `${environment.baseUrl}/comments`;

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter un commentaire
  addComment(
    postId: string,
    content: string,
    parentComment?: string
  ): Observable<any> {
    const token = localStorage.getItem("token"); // Assume que tu stockes le token dans localStorage

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    const body = {
      postId,
      content,
      parentComment,
    };

    return this.http.post(`${this._commentURL}`, body, { headers });
  }

  // Méthode pour récupérer les commentaires d'un post spécifique
  getComments(postId: string): Observable<any> {
    return this.http.get(`${this._commentURL}/${postId}/comments`);
  }
}
