import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TipoUsuario } from './auth.service';

export interface PerfilDetalhe {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  endereco: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  observacoes?: string | null;
  status?: string | null;
  codigoAdmin?: string | null;
}

export interface AtualizarPerfilRequest {
  nome: string;
  telefone: string | null;
  endereco: string | null;
  observacoes?: string | null;
}

export interface MensagemResponse {
  mensagem: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContaService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:8080';

  private urlPerfil(tipo: TipoUsuario): string {
    switch (tipo) {
      case 'ADOTANTE':
        return `${this.baseUrl}/adotante/perfil`;
      case 'ONG':
        return `${this.baseUrl}/ong/perfil`;
      default:
        return `${this.baseUrl}/admin/perfil`;
    }
  }

  buscarPerfil(tipo: TipoUsuario): Observable<PerfilDetalhe> {
    return this.http.get<PerfilDetalhe>(this.urlPerfil(tipo));
  }

  atualizarPerfil(
    tipo: TipoUsuario,
    dados: AtualizarPerfilRequest,
  ): Observable<PerfilDetalhe> {
    return this.http.put<PerfilDetalhe>(this.urlPerfil(tipo), dados);
  }

  alterarSenha(
    senhaAtual: string,
    novaSenha: string,
  ): Observable<MensagemResponse> {
    return this.http.put<MensagemResponse>(`${this.baseUrl}/conta/senha`, {
      senhaAtual,
      novaSenha,
    });
  }

  solicitarTrocaEmail(
    novoEmail: string,
    senha: string,
  ): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.baseUrl}/conta/email/solicitar`,
      { novoEmail, senha },
    );
  }

  confirmarTrocaEmail(token: string): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.baseUrl}/conta/email/confirmar`,
      { token },
    );
  }

  solicitarExclusao(senha: string): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.baseUrl}/conta/excluir/solicitar`,
      { senha },
    );
  }

  confirmarExclusao(token: string): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.baseUrl}/conta/excluir/confirmar`,
      { token },
    );
  }
}
