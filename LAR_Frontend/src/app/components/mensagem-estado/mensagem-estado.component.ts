import { Component, Input } from '@angular/core';

export type TipoMensagemEstado = 'carregando' | 'erro' | 'vazio';

@Component({
  selector: 'app-mensagem-estado',
  standalone: true,
  imports: [],
  templateUrl: './mensagem-estado.component.html',
  styleUrl: './mensagem-estado.component.css',
})
export class MensagemEstadoComponent {
  @Input({ required: true }) tipo!: TipoMensagemEstado;
  @Input() titulo = '';
  @Input() texto = '';
}
