import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AnimalCatalogo } from '../../services/catalogo-animais.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { AvisoAuthService } from '../../services/aviso-auth.service';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.css',
})
export class AnimalCardComponent {
  @Input({ required: true }) animal!: AnimalCatalogo;
  @Output() erroFavorito = new EventEmitter<string>();
  @Output() favoritoAlterado = new EventEmitter<boolean>();

  private readonly favoritoService = inject(FavoritoService);
  private readonly authService = inject(AuthService);
  private readonly avisoAuthService = inject(AvisoAuthService);

  @Input() favoritado = false;
  processandoFavorito = false;

  get usuarioLogado(): boolean {
    return this.authService.estaAutenticado();
  }

  alternarFavorito(evento: Event): void {
    evento.stopPropagation();

    if (!this.usuarioLogado) {
      this.avisoAuthService.mostrar(
        'Você precisa estar logado como Adotante para favoritar.',
      );
      return;
    }

    if (this.processandoFavorito) {
      return;
    }

    this.processandoFavorito = true;

    const estavaFavoritado = this.favoritado;

    const acao = this.favoritado
      ? this.favoritoService.desfavoritar(this.animal.id)
      : this.favoritoService.favoritar(this.animal.id);

    acao.subscribe({
      next: () => {
        this.favoritado = !this.favoritado;
        this.processandoFavorito = false;
        this.favoritoAlterado.emit(this.favoritado);
      },
      error: (erro: HttpErrorResponse) => {
        this.processandoFavorito = false;

        if (erro.status === 401 || erro.status === 403) {
          this.avisoAuthService.mostrar(
            'Você precisa estar logado como Adotante para favoritar.',
          );
        } else if (erro.status === 409 && !estavaFavoritado) {
          this.favoritado = true;
          this.favoritoAlterado.emit(true);
        } else if (erro.status === 404 && estavaFavoritado) {
          this.favoritado = false;
          this.favoritoAlterado.emit(false);
        } else {
          this.erroFavorito.emit('Não foi possível favoritar este animal.');
        }
      },
    });
  }

  imagemAnimal(): string {
    return this.animal.foto || '/assets/camera.svg';
  }

  erroImagem(event: Event): void {
    const imagem = event.target as HTMLImageElement;
    imagem.src = '/assets/camera.svg';
  }

  classeStatus(): string {
    switch (this.animal.status) {
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

  get exibirStatus(): boolean {
    return this.animal.status !== 'DISPONIVEL';
  }

  idadeTexto(): string {
    const idade = this.animal.idade;
    if (idade === 0) {
      return 'Menos de 1 ano';
    }
    return idade === 1 ? '1 ano' : `${idade} anos`;
  }

  detalhesTexto(): string {
    return [this.idadeTexto(), this.animal.porte, this.animal.raca]
      .filter((parte) => !!parte)
      .join(' · ');
  }

  nomeStatus(): string {
    switch (this.animal.status) {
      case 'DISPONIVEL':
        return 'Disponível';
      case 'ADOTADO':
        return 'Adotado';
      case 'EM_TRATAMENTO':
        return 'Em tratamento';
      default:
        return this.animal.status;
    }
  }
}
