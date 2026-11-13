import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AvisoAuthService } from './aviso-auth.service';

const endpointsDeAutenticacaoIgnorados = [
  '/auth/login',
  '/auth/recuperar-senha',
  '/auth/redefinir-senha',
  '/auth/logout',
];

function ehEndpointDeAutenticacao(url: string): boolean {
  const caminho = url.split('?')[0].replace(/\/+$/, '').toLowerCase();
  return endpointsDeAutenticacaoIgnorados.some((endpoint) =>
    caminho.endsWith(endpoint),
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const avisoAuthService = inject(AvisoAuthService);
  const router = inject(Router);
  const token = authService.obterToken();

  const requisicao = token && !req.headers.has('Authorization')
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(requisicao).pipe(
    catchError((erro: unknown) => {
      const respostaNaoAutorizada =
        erro instanceof HttpErrorResponse && erro.status === 401;
      const requisicaoAutenticada = requisicao.headers.has('Authorization');

      if (
        respostaNaoAutorizada &&
        requisicaoAutenticada &&
        !ehEndpointDeAutenticacao(requisicao.urlWithParams) &&
        authService.estaAutenticado()
      ) {
        authService.limparToken();
        avisoAuthService.mostrar(
          'Sua sessão expirou. Faça login novamente.',
        );
        void router.navigate(['/login']);
      }

      return throwError(() => erro);
    }),
  );
};
