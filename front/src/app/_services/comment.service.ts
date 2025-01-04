import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = `${environment.baseUrl}/comments`;

  constructor(private http: HttpClient) { }

  // Ajouter un commentaire
  addComment(postId: string, content: string, parentComment: string | null = null): Observable<any> {
    const payload = {
      postId,
      content,
      parentComment
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  // Récupérer les commentaires d'un post
  getComments(postId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${postId}/comments`);
  }

}
