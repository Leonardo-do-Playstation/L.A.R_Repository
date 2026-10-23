import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type StatusOng = 'PENDENTE' | 'APROVADA' | 'RECUSADA';

export interface OngPendente {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  cnpj: string | null;
  endereco: string | null;
  dataCadastro: string | null;
  status: StatusOng;
}

@Injectable({ providedIn: 'root' })
export class OngAdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/admin/ongs';

  listarPendentes(): Observable<OngPendente[]> {
    return this.http.get<OngPendente[]>(`${this.apiUrl}/pendentes`);
  }

  listar(status?: StatusOng): Observable<OngPendente[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<OngPendente[]>(this.apiUrl, { params });
  }

  aprovar(id: number): Observable<OngPendente> {
    return this.http.put<OngPendente>(`${this.apiUrl}/${id}/aprovar`, {});
  }

  recusar(id: number, motivo: string): Observable<OngPendente> {
    return this.http.put<OngPendente>(`${this.apiUrl}/${id}/recusar`, { motivo });
  }
}