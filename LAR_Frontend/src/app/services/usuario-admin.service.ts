import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TipoUsuario } from './auth.service';

export interface UsuarioAdmin {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  endereco: string | null;
  tipo: TipoUsuario;
  bloqueado: boolean;
  cpf: string | null;
  cnpj: string | null;
  statusOng: 'PENDENTE' | 'APROVADA' | 'RECUSADA' | null;
  codigoAdmin: string | null;
}

export interface AtualizarUsuarioAdmin {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioAdminService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/admin/usuarios';

  listarTodos(): Observable<UsuarioAdmin[]> {
    return this.http.get<UsuarioAdmin[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<UsuarioAdmin> {
    return this.http.get<UsuarioAdmin>(`${this.apiUrl}/${id}`);
  }

  buscar(termo: string): Observable<UsuarioAdmin[]> {
    const params = new HttpParams().set('termo', termo);

    return this.http.get<UsuarioAdmin[]>(`${this.apiUrl}/buscar`, { params });
  }

  editar(id: number, dados: AtualizarUsuarioAdmin): Observable<UsuarioAdmin> {
    return this.http.put<UsuarioAdmin>(`${this.apiUrl}/${id}`, dados);
  }

  alternarBloqueio(id: number): Observable<UsuarioAdmin> {
    return this.http.patch<UsuarioAdmin>(`${this.apiUrl}/${id}/bloqueio`, {});
  }
}
