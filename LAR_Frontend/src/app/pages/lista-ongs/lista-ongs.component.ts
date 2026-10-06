import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { OngPublica, OngService } from '../../services/ong.service';

@Component({
  selector: 'app-lista-ongs',
  standalone: true,
  imports: [],
  templateUrl: './lista-ongs.component.html',
  styleUrl: './lista-ongs.component.css',
})
export class ListaOngsComponent implements OnInit {
  private readonly ongService = inject(OngService);
  private readonly router = inject(Router);

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

  abrirOng(ong: OngPublica): void {
    this.router.navigate(['/ongs', ong.id]);
  }

  inicial(nome: string): string {
    return nome.trim().charAt(0).toUpperCase();
  }
}
