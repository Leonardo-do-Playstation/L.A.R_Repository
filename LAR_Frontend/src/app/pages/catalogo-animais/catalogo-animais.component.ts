import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import {
  CatalogoAnimaisService,
  AnimalCatalogo,
} from '../../services/catalogo-animais.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';

@Component({
  selector: 'app-catalogo-animais',
  standalone: true,
  imports: [AnimalCardComponent],
  templateUrl: './catalogo-animais.component.html',
  styleUrl: './catalogo-animais.component.css',
})
export class CatalogoAnimaisComponent implements OnInit {
  private readonly catalogoAnimaisService = inject(CatalogoAnimaisService);

  animais: AnimalCatalogo[] = [];

  carregando = true;
  erro = '';

  ordem: 'recentes' | 'antigos' = 'recentes';

  ngOnInit(): void {
    this.carregarAnimais();
  }

  carregarAnimais(): void {
    this.carregando = true;
    this.erro = '';

    this.catalogoAnimaisService.listar().subscribe({
      next: (animais) => {
        this.animais = animais;
        this.carregando = false;
      },

      error: () => {
        this.carregando = false;
        this.erro = 'Não foi possível carregar o catálogo de animais.';
      },
    });
  }

  ordenar(tipo: 'recentes' | 'antigos'): void {
    this.ordem = tipo;

    if (tipo === 'recentes') {
      this.animais = [...this.animais];
      return;
    }

    this.animais = [...this.animais].reverse();
  }

  mostrarErroFavorito(mensagem: string): void {
    this.erro = mensagem;
  }
}
