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
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { PaginacaoComponent } from '../../components/paginacao/paginacao.component';

type CategoriaFiltro = 'especie' | 'raca' | 'porte' | 'idade' | 'sexo' | 'cor';

interface ChipFiltro {
  chave: keyof FiltrosCatalogo;
  rotulo: string;
}

@Component({
  selector: 'app-catalogo-animais',
  standalone: true,
  imports: [
    AnimalCardComponent,
    FormsModule,
    BotaoVoltarComponent,
    MensagemEstadoComponent,
    PaginacaoComponent,
    SkeletonComponent,
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
  filtrosAplicados: FiltrosCatalogo = {};

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
      .listarPagina(this.filtrosAplicados, this.pagina, this.ordem)
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
    this.filtros = { ...this.filtrosAplicados };
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
    const atuais = this.filtros;
    const aplicados: FiltrosCatalogo = {};

    if (atuais.especie) {
      aplicados.especie = atuais.especie;
    }

    if (atuais.raca) {
      aplicados.raca = atuais.raca;
    }

    if (atuais.porte) {
      aplicados.porte = atuais.porte;
    }

    if (atuais.sexo) {
      aplicados.sexo = atuais.sexo;
    }

    if (atuais.cor) {
      aplicados.cor = atuais.cor;
    }

    if (atuais.idadeMinima != null) {
      aplicados.idadeMinima = atuais.idadeMinima;
    }

    if (atuais.idadeMaxima != null) {
      aplicados.idadeMaxima = atuais.idadeMaxima;
    }

    this.filtrosAplicados = aplicados;
    this.filtros = { ...aplicados };
    this.fecharFiltros();
    this.irParaPagina(1);
  }

  limparFiltros(): void {
    this.filtros = {};
    this.filtrosAplicados = {};
    this.fecharFiltros();
    this.irParaPagina(1);
  }

  removerFiltro(chave: keyof FiltrosCatalogo): void {
    const restantes = { ...this.filtrosAplicados };
    delete restantes[chave];

    this.filtrosAplicados = restantes;
    this.filtros = { ...restantes };
    this.irParaPagina(1);
  }

  get chipsFiltros(): ChipFiltro[] {
    const filtros = this.filtrosAplicados;
    const chips: ChipFiltro[] = [];

    if (filtros.especie) {
      chips.push({ chave: 'especie', rotulo: `Espécie: ${filtros.especie}` });
    }

    if (filtros.raca) {
      chips.push({ chave: 'raca', rotulo: `Raça: ${filtros.raca}` });
    }

    if (filtros.porte) {
      chips.push({ chave: 'porte', rotulo: `Porte: ${filtros.porte}` });
    }

    if (filtros.sexo) {
      chips.push({
        chave: 'sexo',
        rotulo: `Sexo: ${filtros.sexo === 'MACHO' ? 'Macho' : 'Fêmea'}`,
      });
    }

    if (filtros.cor) {
      chips.push({ chave: 'cor', rotulo: `Cor: ${filtros.cor}` });
    }

    if (filtros.idadeMinima != null) {
      chips.push({
        chave: 'idadeMinima',
        rotulo: `Idade mínima: ${this.formatarIdade(filtros.idadeMinima)}`,
      });
    }

    if (filtros.idadeMaxima != null) {
      chips.push({
        chave: 'idadeMaxima',
        rotulo: `Idade máxima: ${this.formatarIdade(filtros.idadeMaxima)}`,
      });
    }

    return chips;
  }

  private formatarIdade(idade: number): string {
    return idade === 1 ? '1 ano' : `${idade} anos`;
  }

  get quantidadeFiltrosAtivos(): number {
    return this.chipsFiltros.length;
  }

  get textoContador(): string {
    const total = this.totalElementos.toLocaleString('pt-BR');

    return this.totalElementos === 1
      ? 'Foi encontrado 1 resultado'
      : `Foram encontrados ${total} resultados`;
  }
}
