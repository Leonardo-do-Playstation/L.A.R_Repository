import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from './auth.service';

export const superAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  return authService.buscarPerfilAtual().pipe(
    map((perfil) =>
      perfil.tipo === 'ADMINISTRADOR' && perfil.superAdmin === true
        ? true
        : router.createUrlTree(['/acesso-negado']),
    ),
    catchError((erro: unknown) => {
      if (!(erro instanceof HttpErrorResponse && erro.status === 401)) {
        authService.limparToken();
      }

      return of(router.createUrlTree(['/login']));
    }),
  );
};