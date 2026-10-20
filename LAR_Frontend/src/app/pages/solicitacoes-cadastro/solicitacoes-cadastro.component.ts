import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { OngAdminService, OngPendente } from '../../services/ong-admin.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

@Component({
  selector: 'app-solicitacoes-cadastro',
  standalone: true,
  imports: [BotaoVoltarComponent, MensagemEstadoComponent, RouterLink],
  templateUrl: './solicitacoes-cadastro.component.html',
  styleUrl: './solicitacoes-cadastro.component.css',
})
export class SolicitacoesCadastroComponent implements OnInit {
  private readonly ongAdminService = inject(OngAdminService);

  solicitacoes: OngPendente[] = [];

  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    this.carregando = true;
    this.erro = '';

    this.ongAdminService.listarPendentes().subscribe({
      next: (solicitacoes) => {
        this.solicitacoes = solicitacoes;
        this.carregando = false;
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        if (erro.status === 401) {
          this.erro = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.status === 403) {
          this.erro = 'Você não possui permissão para acessar esta área.';
        } else {
          this.erro = 'Não foi possível carregar as solicitações de cadastro.';
        }
      },
    });
  }

  tempoRelativo(dataIso: string): string {
    const data = new Date(dataIso);
    const diffMs = Date.now() - data.getTime();

    const minutos = Math.floor(diffMs / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias >= 1) {
      return `${dias}d atrás`;
    }

    if (horas >= 1) {
      return `${horas}h atrás`;
    }

    if (minutos >= 1) {
      return `${minutos}min atrás`;
    }

    return 'agora';
  }
}
