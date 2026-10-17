import { Component, Input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HistoricoNavegacaoService } from '../../services/historico-navegacao.service';

@Component({
  selector: 'app-botao-voltar',
  standalone: true,
  imports: [],
  templateUrl: './botao-voltar.component.html',
  styleUrl: './botao-voltar.component.css',
})
export class BotaoVoltarComponent {
  @Input() fallback = '/home';
  @Input() rotulo = '';

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly historico = inject(HistoricoNavegacaoService);

  voltar(): void {
    if (this.historico.possuiHistorico()) {
      this.location.back();
      return;
    }

    this.router.navigateByUrl(this.fallback);
  }
}
