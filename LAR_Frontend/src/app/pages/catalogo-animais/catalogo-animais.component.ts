import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CatalogoAnimaisService,
  AnimalCatalogo,
  FiltrosCatalogo,
} from '../../services/catalogo-animais.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';
import { AuthService } from '../../services/auth.service';
import { FavoritoService } from '../../services/favorito.service';

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
  private readonly favoritoService = inject(FavoritoService);
  private readonly authService = inject(AuthService);

  animais: AnimalCatalogo[] = [];
  private animaisOriginais: AnimalCatalogo[] = [];

  favoritosIds = new Set<number>();

  carregando = true;
  erro = '';

  ordem: 'recentes' | 'antigos' = 'recentes';

  filtros: FiltrosCatalogo = {};

  mostrarFiltros = false;
  categoriaExpandida: CategoriaFiltro | null = null;

  ngOnInit(): void {
    this.carregarAnimais();
    this.carregarFavoritos();
  }

  carregarFavoritos(): void {
    const perfil = this.authService.obterPerfil();

    if (!this.authService.estaAutenticado() || perfil?.tipo !== 'ADOTANTE') {
      return;
    }

    this.favoritoService.listarIds().subscribe({
      next: (ids) => {
        this.favoritosIds = ids;
      },
      error: () => {},
    });
  }

  aoAlterarFavorito(animalId: number, favoritado: boolean): void {
    if (favoritado) {
      this.favoritosIds.add(animalId);
    } else {
      this.favoritosIds.delete(animalId);
    }
  }

  carregarAnimais(): void {
    this.carregando = true;
    this.erro = '';

    this.catalogoAnimaisService.listar(this.filtros).subscribe({
      next: (animais) => {
        this.animaisOriginais = [...animais];
        this.atualizarOrdenacao();
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
    this.atualizarOrdenacao();
  }

  private atualizarOrdenacao(): void {
    const animais = [...this.animaisOriginais];
    this.animais = this.ordem === 'recentes' ? animais : animais.reverse();
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
