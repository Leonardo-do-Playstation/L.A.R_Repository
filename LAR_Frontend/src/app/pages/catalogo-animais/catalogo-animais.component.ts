import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  CatalogoAnimaisService,
  AnimalCatalogo,
  FiltrosCatalogo,
  OrdemCatalogo,
} from '../../services/catalogo-animais.service';
import { coresPadrao } from '../../services/animal.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';
import { AuthService } from '../../services/auth.service';
import { FavoritoService } from '../../services/favorito.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';
import { PaginacaoComponent } from '../../components/paginacao/paginacao.component';

type CategoriaFiltro = 'especie' | 'raca' | 'porte' | 'idade' | 'sexo' | 'cor';

@Component({
  selector: 'app-catalogo-animais',
  standalone: true,
  imports: [
    AnimalCardComponent,
    FormsModule,
    BotaoVoltarComponent,
    MensagemEstadoComponent,
    PaginacaoComponent,
  ],
  templateUrl: './catalogo-animais.component.html',
  styleUrl: './catalogo-animais.component.css',
})
export class CatalogoAnimaisComponent implements OnInit {
  private readonly catalogoAnimaisService = inject(CatalogoAnimaisService);
  private readonly favoritoService = inject(FavoritoService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  animais: AnimalCatalogo[] = [];
  pagina = 1;
  totalPaginas = 0;
  totalElementos = 0;
  private requisicaoAnimais?: Subscription;
  private rolarAoTopo = false;
  racasDisponiveis: string[] = [];
  coresDisponiveis: string[] = [];

  favoritosIds = new Set<number>();

  carregando = true;
  erro = '';

  ordem: OrdemCatalogo = 'recentes';

  filtros: FiltrosCatalogo = {};

  mostrarFiltros = false;
  categoriaExpandida: CategoriaFiltro | null = null;

  ngOnInit(): void {
    this.carregarOpcoesFiltros();
    this.carregarFavoritos();

    this.route.queryParamMap.subscribe((params) => {
      this.pagina = this.lerPagina(params.get('pagina'));
      this.carregarAnimais();
    });
  }

  private lerPagina(valor: string | null): number {
    const numero = Number(valor);

    return Number.isInteger(numero) && numero >= 1 ? numero : 1;
  }

  private carregarOpcoesFiltros(): void {
    this.catalogoAnimaisService.listar({}).subscribe({
      next: (animais) => {
        this.racasDisponiveis = this.valoresUnicos(
          animais.map((animal) => animal.raca),
        );
        this.coresDisponiveis = this.valoresUnicos(
          animais.map((animal) => animal.cor),
          coresPadrao(),
        );
      },
      error: () => {
        this.racasDisponiveis = [];
        this.coresDisponiveis = [];
      },
    });
  }

  private valoresUnicos(
    valores: (string | null | undefined)[],
    padroes: string[] = [],
  ): string[] {
    const grafiaPadrao = new Map(
      padroes.map((padrao) => [padrao.toLowerCase(), padrao]),
    );
    const unicos = new Map<string, string>();

    for (const valor of valores) {
      const texto = valor?.trim();

      if (!texto) {
        continue;
      }

      const chave = texto.toLowerCase();

      if (!unicos.has(chave)) {
        unicos.set(chave, grafiaPadrao.get(chave) ?? texto);
      }
    }

    return [...unicos.values()].sort((a, b) => a.localeCompare(b, 'pt-BR'));
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

    this.requisicaoAnimais?.unsubscribe();

    this.requisicaoAnimais = this.catalogoAnimaisService
      .listarPagina(this.filtros, this.pagina, this.ordem)
      .subscribe({
        next: (resultado) => {
          if (
            resultado.totalPaginas > 0 &&
            this.pagina > resultado.totalPaginas
          ) {
            this.irParaPagina(resultado.totalPaginas, true);
            return;
          }

          this.animais = resultado.animais;
          this.totalPaginas = resultado.totalPaginas;
          this.totalElementos = resultado.totalElementos;
          this.carregando = false;

          if (this.rolarAoTopo) {
            this.rolarAoTopo = false;
            window.scrollTo({ top: 0 });
          }
        },
        error: () => {
          this.carregando = false;
          this.erro = 'Não foi possível carregar o catálogo de animais.';
        },
      });
  }

  private irParaPagina(pagina: number, substituirHistorico = false): void {
    if (pagina === this.pagina) {
      this.carregarAnimais();
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pagina: pagina > 1 ? pagina : null },
      queryParamsHandling: 'merge',
      replaceUrl: substituirHistorico,
    });
  }

  aoMudarPagina(pagina: number): void {
    this.rolarAoTopo = true;
    this.irParaPagina(pagina);
  }

  ordenar(tipo: OrdemCatalogo): void {
    if (tipo === this.ordem) {
      return;
    }

    this.ordem = tipo;
    this.irParaPagina(1);
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
    this.irParaPagina(1);
  }

  limparFiltros(): void {
    this.filtros = {};
    this.fecharFiltros();
    this.irParaPagina(1);
  }

  get quantidadeFiltrosAtivos(): number {
    return Object.values(this.filtros).filter(
      (valor) => valor !== undefined && valor !== null && valor !== '',
    ).length;
  }
}
