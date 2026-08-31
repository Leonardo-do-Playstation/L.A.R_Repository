import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
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

  obterUsuarioAutenticado(): Observable<string> {
    return this.http.get(`${this.apiUrl}/me`, {
      responseType: 'text',
    });
  }

  salvarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  obterToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  estaAutenticado(): boolean {
    return this.obterToken() !== null;
  }

  limparToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
