import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  EMPTY,
  Subject,
  catchError,
  debounceTime,
  switchMap,
  tap,
} from 'rxjs';

import {
  AuditoriaService,
  RegistroAuditoria,
} from '../../services/auditoria.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

@Component({
  selector: 'app-auditoria-admin',
  standalone: true,
  imports: [BotaoVoltarComponent, MensagemEstadoComponent],
  templateUrl: './auditoria-admin.component.html',
  styleUrl: './auditoria-admin.component.css',
})
export class AuditoriaAdminComponent implements OnInit {
  private readonly auditoriaService = inject(AuditoriaService);

  private readonly consulta$ = new Subject<void>();

  registros: RegistroAuditoria[] = [];

  responsavel = '';
  data = '';

  carregando = true;
  erro = '';

  private readonly rotulosAcao: Record<string, string> = {
    APROVAR_ONG: 'ONG aprovada',
    RECUSAR_ONG: 'ONG recusada',
    BLOQUEAR_USUARIO: 'Usuário bloqueado',
    DESBLOQUEAR_USUARIO: 'Usuário desbloqueado',
    EDITAR_USUARIO: 'Usuário editado',
    CONVIDAR_ADMINISTRADOR: 'Administrador convidado',
    ATIVAR_ADMINISTRADOR: 'Administrador ativado',
  };

  ngOnInit(): void {
    this.consulta$
      .pipe(
        debounceTime(300),
        tap(() => {
          this.carregando = true;
          this.erro = '';
        }),
        switchMap(() =>
          this.auditoriaService.listar(this.responsavel, this.data).pipe(
            catchError((erro: HttpErrorResponse) => {
              this.carregando = false;
              this.registros = [];
              this.erro = this.mensagemErro(erro);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe((registros) => {
        this.registros = registros;
        this.carregando = false;
      });

    this.consulta$.next();
  }

  aoDigitarResponsavel(valor: string): void {
    this.responsavel = valor;
    this.consulta$.next();
  }

  aoSelecionarData(valor: string): void {
    this.data = valor;
    this.consulta$.next();
  }

  limparFiltros(): void {
    this.responsavel = '';
    this.data = '';
    this.consulta$.next();
  }

  get temFiltro(): boolean {
    return !!this.responsavel.trim() || !!this.data;
  }

  rotuloAcao(acao: string): string {
    return this.rotulosAcao[acao] ?? acao;
  }

  formatarDataHora(valor: string | number[]): string {
    const data = Array.isArray(valor)
      ? new Date(
          valor[0],
          valor[1] - 1,
          valor[2],
          valor[3] ?? 0,
          valor[4] ?? 0,
          valor[5] ?? 0,
        )
      : new Date(valor);

    if (isNaN(data.getTime())) {
      return '—';
    }

    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private mensagemErro(erro: HttpErrorResponse): string {
    if (erro.status === 401) {
      return 'Sua sessão expirou. Faça login novamente.';
    }

    if (erro.status === 403) {
      return 'Você não possui permissão para acessar esta área.';
    }

    if (erro.status === 409 || erro.status === 400) {
      return erro.error?.mensagem || 'Filtro inválido.';
    }

    return 'Não foi possível carregar o registro de ações.';
  }
}