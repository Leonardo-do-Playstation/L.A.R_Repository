import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [RouterLink, BotaoVoltarComponent],
  templateUrl: './acesso-negado.component.html',
  styleUrl: './acesso-negado.component.css',
})
export class AcessoNegadoComponent {
  private readonly route = inject(ActivatedRoute);

  mensagem = 'Você não tem permissão para acessar esta área.';

  constructor() {
    const motivo = this.route.snapshot.queryParamMap.get('motivo');

    if (motivo === 'ong-pendente') {
      this.mensagem =
        'Sua ONG está com cadastro pendente de aprovação. Aguarde a análise de um administrador para acessar esta área.';
    } else if (motivo === 'ong-recusada') {
      this.mensagem =
        'O cadastro da sua ONG foi recusado. Entre em contato com o suporte para mais informações.';
    }
  }
}
