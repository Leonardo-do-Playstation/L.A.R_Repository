import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [BotaoVoltarComponent, RouterLink],
  templateUrl: './termos.component.html',
  styleUrl: './termos.component.css',
})
export class TermosComponent {
  @Input() embutido = false;

  @Output() abrirOutro = new EventEmitter<void>();

  readonly ultimaAtualizacao = '15 de novembro de 2026';
}
