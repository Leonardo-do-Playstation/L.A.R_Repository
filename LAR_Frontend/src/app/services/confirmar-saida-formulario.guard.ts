import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmacaoModalService } from './confirmacao-modal.service';

export interface FormularioComAlteracoesPendentes {
  temAlteracoesPendentes(): boolean;
}

export const confirmarSaidaFormularioGuard: CanDeactivateFn<FormularioComAlteracoesPendentes> =
  (componente) => {
    if (!componente.temAlteracoesPendentes()) {
      return true;
    }

    return inject(ConfirmacaoModalService).confirmar(
      'Você tem alterações não salvas. Deseja sair sem salvar?',
    );
  };
