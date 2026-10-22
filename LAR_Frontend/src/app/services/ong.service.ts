import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PerfilDetalhe } from './conta.service';

export interface OngPublica {
  id: number;
  nome: string;
  cnpj: string | null;
  telefone: string | null;
  endereco: string | null;
  observacoes: string | null;
  foto: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class OngService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/ongs';

  private readonly fotoUrl = 'http://localhost:8080/ong/perfil/foto';

  listar(): Observable<OngPublica[]> {
    return this.http.get<OngPublica[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<OngPublica> {
    return this.http.get<OngPublica>(`${this.apiUrl}/${id}`);
  }

  enviarFoto(foto: File): Observable<PerfilDetalhe> {
    const formData = new FormData();
    formData.append('foto', foto);

    return this.http.put<PerfilDetalhe>(this.fotoUrl, formData);
  }

  removerFoto(): Observable<PerfilDetalhe> {
    return this.http.delete<PerfilDetalhe>(this.fotoUrl);
  }
}