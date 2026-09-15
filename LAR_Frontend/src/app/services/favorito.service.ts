import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritoService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/favoritos';

  favoritar(animalId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${animalId}`, {});
  }

  desfavoritar(animalId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${animalId}`);
  }
}