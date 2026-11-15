import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-privacidade',
  standalone: true,
  imports: [BotaoVoltarComponent, RouterLink],
  templateUrl: './privacidade.component.html',
  styleUrl: './privacidade.component.css',
})
export class PrivacidadeComponent {
  @Input() embutido = false;

  @Output() abrirOutro = new EventEmitter<void>();

  readonly ultimaAtualizacao = '15 de novembro de 2026';
}
