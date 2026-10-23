import { inject } from '@angular/core';
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
    catchError(() => {
      authService.limparToken();
      return of(router.createUrlTree(['/login']));
    }),
  );
};