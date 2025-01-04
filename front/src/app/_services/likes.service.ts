import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private _postURL = `${environment.baseUrl}/likes`;

  constructor(private http: HttpClient) { }

  /**
   * Toggle le like (ajouter ou supprimer) d'un post
   * @param postId - L'ID du post à liker ou disliker
   * @returns Observable avec la réponse du backend contenant le nouveau nombre de likes
   */
  toggleLike(postId: string): Observable<any> {
    return this.http.post<any>(`${this._postURL}/like`, { postId });
  }
}
