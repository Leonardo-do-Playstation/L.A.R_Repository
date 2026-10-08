import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OngPublica {
  id: number;
  nome: string;
  cnpj: string | null;
  telefone: string | null;
  endereco: string | null;
  observacoes: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class OngService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/ongs';

  listar(): Observable<OngPublica[]> {
    return this.http.get<OngPublica[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<OngPublica> {
    return this.http.get<OngPublica>(`${this.apiUrl}/${id}`);
  }
}
