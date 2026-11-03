import { Component, Input } from '@angular/core';

export type TipoContato = 'whatsapp' | 'maps';

@Component({
  selector: 'app-botao-contato',
  standalone: true,
  imports: [],
  templateUrl: './botao-contato.component.html',
  styleUrl: './botao-contato.component.css',
})
export class BotaoContatoComponent {
  @Input({ required: true }) tipo!: TipoContato;
  @Input({ required: true }) href!: string | null;
  @Input({ required: true }) rotulo!: string;
  @Input() texto = '';

  get icone(): string {
    return this.tipo === 'whatsapp'
      ? '/assets/whatsapp.svg'
      : '/assets/google-maps.svg';
  }
}
