import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConvidarAdministradorRequest {
  nome: string;
  email: string;
  codigoAdmin: string;
}

export interface AtivarAdministradorRequest {
  token: string;
  senha: string;
  confirmarSenha: string;
}

export interface MensagemResponse {
  mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class AdministradorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/admin/administradores';

  convidar(dados: ConvidarAdministradorRequest): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(this.baseUrl, dados);
  }

  ativar(dados: AtivarAdministradorRequest): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(`${this.baseUrl}/ativar`, dados);
  }
}