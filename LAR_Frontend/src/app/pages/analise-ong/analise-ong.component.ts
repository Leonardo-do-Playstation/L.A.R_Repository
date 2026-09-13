import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { OngAdminService, OngPendente } from '../../services/ong-admin.service';

@Component({
  selector: 'app-analise-ong',
  standalone: true,
  imports: [FormsModule],
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

  mostrarRecusa = false;
  motivoRecusa = '';
  enviandoRecusa = false;
  erroRecusa = '';

  mostrarValidacao = false;
  validando = false;
  erroValidacao = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarOng(id);
  }

  carregarOng(id: number): void {
    this.carregando = true;
    this.erro = '';

    this.ongAdminService.listarPendentes().subscribe({
      next: (solicitacoes) => {
        this.ong = solicitacoes.find((item) => item.id === id) ?? null;
        this.carregando = false;

        if (!this.ong) {
          this.erro = 'Esta solicitação não está mais disponível.';
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

  voltar(): void {
    this.router.navigate(['/admin/ongs-pendentes']);
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
    if (!this.ong) {
      return;
    }

    this.enviandoRecusa = true;
    this.erroRecusa = '';

    this.ongAdminService.recusar(this.ong.id, this.motivoRecusa).subscribe({
      next: () => {
        this.enviandoRecusa = false;
        this.mostrarRecusa = false;
        this.exibirFeedbackERedirecionar('Solicitação recusada com sucesso.');
      },

      error: () => {
        this.enviandoRecusa = false;
        this.erroRecusa =
          'Não foi possível recusar esta solicitação. Tente novamente.';
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
    if (!this.ong) {
      return;
    }

    this.validando = true;
    this.erroValidacao = '';

    this.ongAdminService.aprovar(this.ong.id).subscribe({
      next: () => {
        this.validando = false;
        this.mostrarValidacao = false;
        this.exibirFeedbackERedirecionar('ONG validada com sucesso.');
      },

      error: () => {
        this.validando = false;
        this.erroValidacao =
          'Não foi possível validar esta ONG. Tente novamente.';
      },
    });
  }

  private exibirFeedbackERedirecionar(mensagem: string): void {
    this.mensagemSucesso = mensagem;

    setTimeout(() => {
      this.router.navigate(['/admin/ongs-pendentes']);
    }, 1400);
  }
}
