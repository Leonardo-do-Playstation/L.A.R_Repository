import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type TipoUsuario = 'ADMINISTRADOR' | 'ONG' | 'ADOTANTE';

export interface Perfil {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  statusOng: 'PENDENTE' | 'APROVADA' | 'RECUSADA' | null;
  superAdmin?: boolean | null;
}

export interface LoginResponse {
  token: string;
  perfil: Perfil;
}

export interface RecuperarSenhaResponse {
  mensagem: string;
  token_teste?: string;
}

interface LoginRequest {
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/auth';
  private readonly tokenKey = 'token';
  private readonly perfilKey = 'perfil';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    const dados: LoginRequest = {
      email,
      senha,
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dados);
  }

  recuperarSenha(email: string): Observable<RecuperarSenhaResponse> {
    return this.http.post<RecuperarSenhaResponse>(
      `${this.apiUrl}/recuperar-senha`,
      { email },
    );
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, {
      token,
      novaSenha,
    });
  }

  logout(): Observable<any> {
    const token = this.obterToken();

    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  buscarPerfilAtual(): Observable<Perfil> {
    return this.http
      .get<Perfil>(`${this.apiUrl}/me`)
      .pipe(tap((perfil) => this.salvarPerfil(perfil)));
  }

  salvarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  obterToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  salvarPerfil(perfil: Perfil): void {
    localStorage.setItem(this.perfilKey, JSON.stringify(perfil));
  }

  obterPerfil(): Perfil | null {
    const bruto = localStorage.getItem(this.perfilKey);

    if (!bruto) {
      return null;
    }

    try {
      return JSON.parse(bruto) as Perfil;
    } catch {
      return null;
    }
  }

  estaAutenticado(): boolean {
    return this.obterToken() !== null;
  }

  limparToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.perfilKey);
  }
}
