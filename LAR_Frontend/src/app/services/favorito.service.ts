import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimalCatalogo } from './catalogo-animais.service';

export interface FavoritoResposta {
  animal: AnimalCatalogo;
  dataFavoritado: string;
}

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

  listar(): Observable<FavoritoResposta[]> {
    return this.http.get<FavoritoResposta[]>(this.apiUrl);
  }
}
