import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { OngPublica, OngService } from '../../services/ong.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

@Component({
  selector: 'app-lista-ongs',
  standalone: true,
  imports: [BotaoVoltarComponent, MensagemEstadoComponent, RouterLink],
  templateUrl: './lista-ongs.component.html',
  styleUrl: './lista-ongs.component.css',
})
export class ListaOngsComponent implements OnInit {
  private readonly ongService = inject(OngService);

  ongs: OngPublica[] = [];

  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregarOngs();
  }

  carregarOngs(): void {
    this.carregando = true;
    this.erro = '';

    this.ongService.listar().subscribe({
      next: (ongs) => {
        this.ongs = ongs;
        this.carregando = false;
      },

      error: (_erro: HttpErrorResponse) => {
        this.carregando = false;
        this.erro = 'Não foi possível carregar as ONGs.';
      },
    });
  }

  inicial(nome: string): string {
    return nome.trim().charAt(0).toUpperCase();
  }
}
