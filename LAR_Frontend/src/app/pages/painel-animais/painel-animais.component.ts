import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Animal, AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-painel-animais',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './painel-animais.component.html',
  styleUrl: './painel-animais.component.css',
})
export class PainelAnimaisComponent implements OnInit {
  private readonly animalService = inject(AnimalService);

  animais: Animal[] = [];

  carregando = true;
  erro = '';

  ordem: 'recentes' | 'antigos' = 'recentes';
  animalParaExcluir: Animal | null = null;
  excluindo = false;

  ngOnInit(): void {
    this.carregarAnimais();
  }

  carregarAnimais(): void {
    this.carregando = true;
    this.erro = '';

    this.animalService.listarMeusAnimais().subscribe({
      next: (animais) => {
        this.animais = animais;
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

    if (tipo === 'recentes') {
      this.animais = [...this.animais];
      return;
    }

    this.animais = [...this.animais].reverse();
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
        this.animais = this.animais.filter((item) => item.id !== animal.id);

        this.animalParaExcluir = null;
        this.excluindo = false;
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
