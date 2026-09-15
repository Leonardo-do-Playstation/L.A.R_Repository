import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService, TipoUsuario } from './auth.service';

export function perfilGuard(tiposPermitidos: TipoUsuario[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.estaAutenticado()) {
      return router.createUrlTree(['/login']);
    }

    const perfilCache = authService.obterPerfil();

    if (perfilCache) {
      return avaliarPerfil(perfilCache, tiposPermitidos, router);
    }

    return authService.buscarPerfilAtual().pipe(
      map((perfil) => avaliarPerfil(perfil, tiposPermitidos, router)),
      catchError(() => {
        authService.limparToken();
        return of(router.createUrlTree(['/login']));
      }),
    );
  };
}

function avaliarPerfil(
  perfil: { tipo: TipoUsuario; statusOng: string | null },
  tiposPermitidos: TipoUsuario[],
  router: Router,
) {
  if (!tiposPermitidos.includes(perfil.tipo)) {
    return router.createUrlTree(['/acesso-negado']);
  }

  if (perfil.tipo === 'ONG' && perfil.statusOng !== 'APROVADA') {
    return router.createUrlTree(['/acesso-negado'], {
      queryParams: { motivo: 'ong-' + perfil.statusOng?.toLowerCase() },
    });
  }

  return true;
}
