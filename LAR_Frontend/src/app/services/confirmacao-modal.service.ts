import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OpcoesConfirmacao {
  titulo: string;
  mensagem: string;
  textoConfirmar: string;
  textoCancelar: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmacaoModalService {
  private readonly solicitacaoSubject =
    new BehaviorSubject<OpcoesConfirmacao | null>(null);

  readonly solicitacao$ = this.solicitacaoSubject.asObservable();

  private resolver: ((confirmado: boolean) => void) | null = null;

  confirmar(
    mensagem: string,
    opcoes: Partial<OpcoesConfirmacao> = {},
  ): Promise<boolean> {
    if (this.resolver) {
      this.resolver(false);
    }

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
      this.solicitacaoSubject.next({
        titulo: opcoes.titulo ?? 'Descartar alterações?',
        mensagem,
        textoConfirmar: opcoes.textoConfirmar ?? 'Descartar alterações',
        textoCancelar: opcoes.textoCancelar ?? 'Continuar editando',
      });
    });
  }

  responder(confirmado: boolean): void {
    const resolver = this.resolver;
    this.resolver = null;
    this.solicitacaoSubject.next(null);
    resolver?.(confirmado);
  }
}
