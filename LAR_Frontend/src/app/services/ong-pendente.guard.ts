import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const ongPendenteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  const perfil = authService.obterPerfil();

  if (perfil?.tipo === 'ONG' && perfil.statusOng === 'PENDENTE') {
    return true;
  }

  return router.createUrlTree(['/home']);
};
