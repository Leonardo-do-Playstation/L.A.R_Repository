import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  OngAdminService,
  OngPendente,
  StatusOng,
} from '../../services/ong-admin.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

export type AbaOng = 'pendentes' | 'aprovadas' | 'recusadas';

interface ConfigAba {
  id: AbaOng;
  rotulo: string;
  status: StatusOng;
  vazioTitulo: string;
  vazioTexto: string;
}

export const ABAS_ONG: ConfigAba[] = [
  {
    id: 'pendentes',
    rotulo: 'Pendentes',
    status: 'PENDENTE',
    vazioTitulo: 'Nenhuma solicitação pendente.',
    vazioTexto: 'Novos cadastros de ONGs aparecerão aqui.',
  },
  {
    id: 'aprovadas',
    rotulo: 'Aprovadas',
    status: 'APROVADA',
    vazioTitulo: 'Nenhuma ONG aprovada.',
    vazioTexto: 'As ONGs validadas aparecerão aqui.',
  },
  {
    id: 'recusadas',
    rotulo: 'Recusadas',
    status: 'RECUSADA',
    vazioTitulo: 'Nenhuma ONG recusada.',
    vazioTexto: 'As ONGs recusadas aparecerão aqui.',
  },
];

@Component({
  selector: 'app-solicitacoes-cadastro',
  standalone: true,
  imports: [BotaoVoltarComponent, MensagemEstadoComponent, RouterLink],
  templateUrl: './solicitacoes-cadastro.component.html',
  styleUrl: './solicitacoes-cadastro.component.css',
})
export class SolicitacoesCadastroComponent implements OnInit {
  private readonly ongAdminService = inject(OngAdminService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly abas = ABAS_ONG;
  abaAtiva: ConfigAba = ABAS_ONG[0];
  solicitacoes: OngPendente[] = [];
  carregando = true;
  erro = '';

  private pedido = 0;

  ngOnInit(): void {
    const aba = this.route.snapshot.queryParamMap.get('aba');
    this.abaAtiva = ABAS_ONG.find((item) => item.id === aba) ?? ABAS_ONG[0];
    this.carregarSolicitacoes();
  }

  selecionarAba(aba: ConfigAba): void {
    if (aba.id === this.abaAtiva.id) return;

    this.abaAtiva = aba;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { aba: aba.id },
      replaceUrl: true,
    });
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    const pedidoAtual = ++this.pedido;

    this.carregando = true;
    this.erro = '';
    this.solicitacoes = [];

    this.ongAdminService.listar(this.abaAtiva.status).subscribe({
      next: (solicitacoes) => {
        if (pedidoAtual !== this.pedido) return;
        this.solicitacoes = solicitacoes;
        this.carregando = false;
      },
      error: (erro: HttpErrorResponse) => {
        if (pedidoAtual !== this.pedido) return;
        this.carregando = false;

        if (erro.status === 401) {
          this.erro = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.status === 403) {
          this.erro = 'Você não possui permissão para acessar esta área.';
        } else {
          this.erro = 'Não foi possível carregar os cadastros de ONGs.';
        }
      },
    });
  }

  tempoRelativo(dataIso: string | null): string {
    if (!dataIso) return '';

    const diffMs = Date.now() - new Date(dataIso).getTime();
    if (Number.isNaN(diffMs)) return '';

    const minutos = Math.floor(diffMs / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias >= 1) return `${dias}d atrás`;
    if (horas >= 1) return `${horas}h atrás`;
    if (minutos >= 1) return `${minutos}min atrás`;
    return 'agora';
  }
}
