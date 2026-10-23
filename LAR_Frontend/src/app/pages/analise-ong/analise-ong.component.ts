import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { OngAdminService, OngPendente } from '../../services/ong-admin.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

@Component({
  selector: 'app-analise-ong',
  standalone: true,
  imports: [FormsModule, BotaoVoltarComponent, MensagemEstadoComponent],
  templateUrl: './analise-ong.component.html',
  styleUrl: './analise-ong.component.css',
})
export class AnaliseOngComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ongAdminService = inject(OngAdminService);

  ong: OngPendente | null = null;

  carregando = true;
  erro = '';
  mensagemSucesso = '';

  abaOrigem = 'pendentes';

  mostrarRecusa = false;
  motivoRecusa = '';
  enviandoRecusa = false;
  erroRecusa = '';

  mostrarValidacao = false;
  validando = false;
  erroValidacao = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.abaOrigem = this.route.snapshot.queryParamMap.get('aba') ?? '';
    this.carregarOng(id);
  }

  carregarOng(id: number): void {
    this.carregando = true;
    this.erro = '';

    this.ongAdminService.listar().subscribe({
      next: (ongs) => {
        this.ong = ongs.find((item) => item.id === id) ?? null;
        this.carregando = false;

        if (!this.ong) {
          this.erro = 'Este cadastro não está mais disponível.';
          return;
        }

        if (!this.abaOrigem) {
          this.abaOrigem = this.abaDoStatus(this.ong.status);
        }
      },
      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        if (erro.status === 401) {
          this.erro = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.status === 403) {
          this.erro = 'Você não possui permissão para acessar esta área.';
        } else {
          this.erro = 'Não foi possível carregar os dados da ONG.';
        }
      },
    });
  }

  abrirRecusa(): void {
    this.motivoRecusa = '';
    this.erroRecusa = '';
    this.mostrarRecusa = true;
  }

  cancelarRecusa(): void {
    this.mostrarRecusa = false;
  }

  confirmarRecusa(): void {
    if (!this.ong) return;

    if (!this.motivoRecusa.trim()) {
      this.erroRecusa = 'Informe o motivo da recusa.';
      return;
    }

    this.enviandoRecusa = true;
    this.erroRecusa = '';

    this.ongAdminService.recusar(this.ong.id, this.motivoRecusa.trim()).subscribe({
      next: () => {
        this.enviandoRecusa = false;
        this.mostrarRecusa = false;
        this.exibirFeedbackERedirecionar('Cadastro recusado. A ONG foi avisada por e-mail.');
      },
      error: (erro: HttpErrorResponse) => {
        this.enviandoRecusa = false;
        this.erroRecusa =
          erro.error?.mensagem || 'Não foi possível recusar este cadastro. Tente novamente.';
      },
    });
  }

  abrirValidacao(): void {
    this.erroValidacao = '';
    this.mostrarValidacao = true;
  }

  cancelarValidacao(): void {
    this.mostrarValidacao = false;
  }

  confirmarValidacao(): void {
    if (!this.ong) return;

    this.validando = true;
    this.erroValidacao = '';

    this.ongAdminService.aprovar(this.ong.id).subscribe({
      next: () => {
        this.validando = false;
        this.mostrarValidacao = false;
        this.exibirFeedbackERedirecionar('ONG validada. Ela foi avisada por e-mail.');
      },
      error: (erro: HttpErrorResponse) => {
        this.validando = false;
        this.erroValidacao =
          erro.error?.mensagem || 'Não foi possível validar esta ONG. Tente novamente.';
      },
    });
  }

  private exibirFeedbackERedirecionar(mensagem: string): void {
    this.mensagemSucesso = mensagem;

    setTimeout(() => {
      this.router.navigate(['/admin/ongs-pendentes'], {
        queryParams: { aba: this.abaOrigem || 'pendentes' },
      });
    }, 1400);
  }

  get podeAprovar(): boolean {
    return this.ong?.status !== 'APROVADA';
  }

  get podeRecusar(): boolean {
    return this.ong?.status !== 'RECUSADA';
  }

  get ehReanalise(): boolean {
    return !!this.ong && this.ong.status !== 'PENDENTE';
  }

  get rotuloStatus(): string {
    switch (this.ong?.status) {
      case 'APROVADA': return 'Aprovada';
      case 'RECUSADA': return 'Recusada';
      default: return 'Pendente';
    }
  }

  private abaDoStatus(status: string): string {
    switch (status) {
      case 'APROVADA': return 'aprovadas';
      case 'RECUSADA': return 'recusadas';
      default: return 'pendentes';
    }
  }
}