import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  Animal,
  AnimalService,
  StatusAnimal,
} from '../../services/animal.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

type CategoriaFiltro =
  | 'especie'
  | 'raca'
  | 'porte'
  | 'idade'
  | 'sexo'
  | 'cor'
  | 'status';

interface FiltrosPainelAnimais {
  especie?: string;
  raca?: string;
  porte?: string;
  sexo?: string;
  cor?: string;
  idadeMinima?: number;
  idadeMaxima?: number;
  status?: StatusAnimal;
}

@Component({
  selector: 'app-painel-animais',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    BotaoVoltarComponent,
    MensagemEstadoComponent,
  ],
  templateUrl: './painel-animais.component.html',
  styleUrl: './painel-animais.component.css',
})
export class PainelAnimaisComponent implements OnInit {
  private readonly animalService = inject(AnimalService);

  animais: Animal[] = [];
  private animaisOriginais: Animal[] = [];

  carregando = true;
  erro = '';

  ordem: 'recentes' | 'antigos' = 'recentes';
  animalParaExcluir: Animal | null = null;
  excluindo = false;
  alterandoStatusId: number | null = null;

  filtros: FiltrosPainelAnimais = {};
  private filtrosAplicados: FiltrosPainelAnimais = {};
  mostrarFiltros = false;
  categoriaExpandida: CategoriaFiltro | null = null;

  readonly statusDisponiveis: {
    valor: StatusAnimal;
    nome: string;
  }[] = [
    { valor: 'DISPONIVEL', nome: 'Disponível' },
    { valor: 'ADOTADO', nome: 'Adotado' },
    { valor: 'EM_TRATAMENTO', nome: 'Em tratamento' },
  ];

  ngOnInit(): void {
    this.carregarAnimais();
  }

  carregarAnimais(): void {
    this.carregando = true;
    this.erro = '';

    this.animalService.listarMeusAnimais().subscribe({
      next: (animais) => {
        this.animaisOriginais = [...animais];
        this.atualizarLista();
        this.carregando = false;
      },
      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        if (erro.status === 401) {
          this.erro = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.status === 403) {
          this.erro = 'Você não possui permissão para acessar este painel.';
        } else {
          this.erro = 'Não foi possível carregar seus animais.';
        }
      },
    });
  }

  ordenar(tipo: 'recentes' | 'antigos'): void {
    this.ordem = tipo;
    this.atualizarLista();
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
    this.filtrosAplicados = { ...this.filtros };
    this.fecharFiltros();
    this.atualizarLista();
  }

  limparFiltros(): void {
    this.filtros = {};
    this.filtrosAplicados = {};
    this.fecharFiltros();
    this.atualizarLista();
  }

  get quantidadeFiltrosAtivos(): number {
    return Object.values(this.filtrosAplicados).filter(
      (valor) => valor !== undefined && valor !== null && valor !== '',
    ).length;
  }

  private atualizarLista(): void {
    const filtros = this.filtrosAplicados;
    let resultado = this.animaisOriginais.filter((animal) => {
      const correspondeEspecie = this.correspondeTexto(
        animal.especie,
        filtros.especie,
      );
      const correspondeRaca = this.correspondeTexto(animal.raca, filtros.raca);
      const correspondePorte = this.correspondeTexto(
        animal.porte,
        filtros.porte,
      );
      const correspondeSexo = this.correspondeTexto(animal.sexo, filtros.sexo);
      const correspondeCor = this.correspondeTexto(animal.cor, filtros.cor);
      const correspondeStatus =
        !filtros.status || animal.status === filtros.status;
      const correspondeIdadeMinima =
        filtros.idadeMinima == null || animal.idade >= filtros.idadeMinima;
      const correspondeIdadeMaxima =
        filtros.idadeMaxima == null || animal.idade <= filtros.idadeMaxima;

      return (
        correspondeEspecie &&
        correspondeRaca &&
        correspondePorte &&
        correspondeSexo &&
        correspondeCor &&
        correspondeStatus &&
        correspondeIdadeMinima &&
        correspondeIdadeMaxima
      );
    });

    resultado = [...resultado].sort((a, b) =>
      this.ordem === 'recentes' ? b.id - a.id : a.id - b.id,
    );

    this.animais = resultado;
  }

  private correspondeTexto(
    valor: string | null | undefined,
    filtro?: string,
  ): boolean {
    if (!filtro) {
      return true;
    }

    return this.normalizar(valor).includes(this.normalizar(filtro));
  }

  private normalizar(valor: string | null | undefined): string {
    return (valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase();
  }

  alterarStatus(animal: Animal, novoStatus: StatusAnimal): void {
    if (novoStatus === animal.status) {
      return;
    }

    this.alterandoStatusId = animal.id;
    this.erro = '';

    this.animalService.alterarStatus(animal.id, novoStatus).subscribe({
      next: (animalAtualizado) => {
        this.animaisOriginais = this.animaisOriginais.map((item) =>
          item.id === animal.id ? animalAtualizado : item,
        );
        this.alterandoStatusId = null;
        this.atualizarLista();
      },
      error: (erro: HttpErrorResponse) => {
        this.alterandoStatusId = null;

        if (erro.status === 401) {
          this.erro = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.status === 403) {
          this.erro =
            'Você não possui permissão para alterar o status deste animal.';
        } else if (erro.status === 404) {
          this.erro = 'Animal não encontrado.';
        } else {
          this.erro = 'Não foi possível alterar o status do animal.';
        }

        this.atualizarLista();
      },
    });
  }

  abrirConfirmacaoExclusao(animal: Animal): void {
    this.animalParaExcluir = animal;
    this.erro = '';
  }

  cancelarExclusao(): void {
    this.animalParaExcluir = null;
  }

  confirmarExclusao(): void {
    if (!this.animalParaExcluir) {
      return;
    }

    const animal = this.animalParaExcluir;

    this.excluindo = true;
    this.erro = '';

    this.animalService.excluirAnimal(animal.id).subscribe({
      next: () => {
        this.animaisOriginais = this.animaisOriginais.filter(
          (item) => item.id !== animal.id,
        );
        this.animalParaExcluir = null;
        this.excluindo = false;
        this.atualizarLista();
      },
      error: (erro: HttpErrorResponse) => {
        this.excluindo = false;

        if (erro.status === 401) {
          this.erro = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.status === 403) {
          this.erro = 'Você não possui permissão para excluir este animal.';
        } else if (erro.status === 404) {
          this.erro = 'Animal não encontrado.';
        } else {
          this.erro = 'Não foi possível excluir o animal.';
        }
      },
    });
  }

  classeStatus(status: string): string {
    switch (status) {
      case 'DISPONIVEL':
        return 'animal-card__status-dot--disponivel';
      case 'ADOTADO':
        return 'animal-card__status-dot--adotado';
      case 'EM_TRATAMENTO':
        return 'animal-card__status-dot--tratamento';
      default:
        return 'animal-card__status-dot--indefinido';
    }
  }

  nomeStatus(status: string): string {
    switch (status) {
      case 'DISPONIVEL':
        return 'Disponível';
      case 'ADOTADO':
        return 'Adotado';
      case 'EM_TRATAMENTO':
        return 'Em tratamento';
      default:
        return status;
    }
  }

  imagemAnimal(animal: Animal): string {
    return animal.foto || '/assets/camera.svg';
  }

  erroImagem(event: Event): void {
    const imagem = event.target as HTMLImageElement;
    imagem.src = '/assets/camera.svg';
  }
}
