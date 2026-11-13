import { Component, HostListener, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ConfirmacaoModalService } from '../../services/confirmacao-modal.service';

@Component({
  selector: 'app-modal-confirmacao',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './modal-confirmacao.component.html',
  styleUrl: './modal-confirmacao.component.css',
})
export class ModalConfirmacaoComponent {
  private readonly confirmacaoService = inject(ConfirmacaoModalService);

  readonly solicitacao$ = this.confirmacaoService.solicitacao$;

  confirmar(): void {
    this.confirmacaoService.responder(true);
  }

  cancelar(): void {
    this.confirmacaoService.responder(false);
  }

  @HostListener('document:keydown.escape')
  aoPressionarEscape(): void {
    this.cancelar();
  }
}
