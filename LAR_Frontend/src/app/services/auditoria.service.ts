import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistroAuditoria {
  id: number;
  usuarioResponsavel: string;
  acao: string;
  dataHora: string | number[];
  registroAfetado: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/admin/auditoria';

  listar(responsavel: string, data: string): Observable<RegistroAuditoria[]> {
    let params = new HttpParams();

    if (responsavel.trim()) {
      params = params.set('responsavel', responsavel.trim());
    }

    if (data) {
      params = params.set('data', data);
    }

    return this.http.get<RegistroAuditoria[]>(this.apiUrl, { params });
  }
}