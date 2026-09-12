import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OngPendente {
  id: number;
  nome: string;
  email: string;
  cnpj: string;
  endereco: string | null;
  data_cadastro: string;
  status: 'PENDENTE' | 'APROVADA' | 'RECUSADA';
}

@Injectable({
  providedIn: 'root',
})
export class OngAdminService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/admin/ongs';

  listarPendentes(): Observable<OngPendente[]> {
    return this.http.get<OngPendente[]>(`${this.apiUrl}/pendentes`);
  }
}
