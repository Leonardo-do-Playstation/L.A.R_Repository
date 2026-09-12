import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { OngAdminService, OngPendente } from '../../services/ong-admin.service';

@Component({
  selector: 'app-analise-ong',
  standalone: true,
  imports: [],
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
}
