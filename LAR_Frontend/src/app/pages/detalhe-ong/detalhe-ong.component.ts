import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { OngPublica, OngService } from '../../services/ong.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-detalhe-ong',
  standalone: true,
  imports: [BotaoVoltarComponent],
  templateUrl: './detalhe-ong.component.html',
  styleUrl: './detalhe-ong.component.css',
})
export class DetalheOngComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ongService = inject(OngService);

  ong: OngPublica | null = null;

  carregando = true;
  naoEncontrado = false;
  erro = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.carregarOng(id);
    });
  }

  carregarOng(id: number): void {
    this.carregando = true;
    this.naoEncontrado = false;
    this.erro = '';

    this.ongService.buscarPorId(id).subscribe({
      next: (ong) => {
        this.ong = ong;
        this.carregando = false;
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        if (erro.status === 404) {
          this.naoEncontrado = true;
        } else if (erro.status === 409) {
          this.erro =
            erro.error?.mensagem ??
            'Esta ONG ainda não está disponível publicamente.';
        } else {
          this.erro = 'Não foi possível carregar os dados desta ONG.';
        }
      },
    });
  }

  get semInformacoes(): boolean {
    return (
      !!this.ong &&
      !this.ong.cnpj &&
      !this.ong.endereco &&
      !this.ong.telefone &&
      !this.ong.observacoes
    );
  }

  inicial(nome: string): string {
    return nome.trim().charAt(0).toUpperCase();
  }

}
