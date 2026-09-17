import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CatalogoAnimaisService,
  AnimalCatalogo,
  FiltrosCatalogo,
} from '../../services/catalogo-animais.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';

type CategoriaFiltro = 'especie' | 'raca' | 'porte' | 'idade' | 'sexo' | 'cor';

@Component({
  selector: 'app-catalogo-animais',
  standalone: true,
  imports: [AnimalCardComponent, FormsModule],
  templateUrl: './catalogo-animais.component.html',
  styleUrl: './catalogo-animais.component.css',
})
export class CatalogoAnimaisComponent implements OnInit {
  private readonly catalogoAnimaisService = inject(CatalogoAnimaisService);

  animais: AnimalCatalogo[] = [];

  carregando = true;
  erro = '';

  ordem: 'recentes' | 'antigos' = 'recentes';

  filtros: FiltrosCatalogo = {};

  mostrarFiltros = false;
  categoriaExpandida: CategoriaFiltro | null = null;

  ngOnInit(): void {
    this.carregarAnimais();
  }

  carregarAnimais(): void {
    this.carregando = true;
    this.erro = '';

    this.catalogoAnimaisService.listar(this.filtros).subscribe({
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

  abrirFiltros(): void {
    this.mostrarFiltros = true;
  }

  fecharFiltros(): void {
    this.mostrarFiltros = false;
    this.categoriaExpandida = null;
  }

  alternarCategoria(categoria: CategoriaFiltro): void {
    this.categoriaExpandida =
      this.categoriaExpandida === categoria ? null : categoria;
  }

  aplicarFiltros(): void {
    this.fecharFiltros();
    this.carregarAnimais();
  }

  limparFiltros(): void {
    this.filtros = {};
    this.fecharFiltros();
    this.carregarAnimais();
  }

  get quantidadeFiltrosAtivos(): number {
    return Object.values(this.filtros).filter(
      (valor) => valor !== undefined && valor !== null && valor !== '',
    ).length;
  }
}
