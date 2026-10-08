import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AnimalCatalogo } from '../../services/catalogo-animais.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { AvisoAuthService } from '../../services/aviso-auth.service';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.css',
})
export class AnimalCardComponent {
  @Input({ required: true }) animal!: AnimalCatalogo;
  @Output() erroFavorito = new EventEmitter<string>();
  @Output() favoritoAlterado = new EventEmitter<boolean>();

  private readonly router = inject(Router);
  private readonly favoritoService = inject(FavoritoService);
  private readonly authService = inject(AuthService);
  private readonly avisoAuthService = inject(AvisoAuthService);

  @Input() favoritado = false;
  processandoFavorito = false;

  get usuarioLogado(): boolean {
    return this.authService.estaAutenticado();
  }

  abrirDetalhes(): void {
    this.router.navigate(['/animais', this.animal.id]);
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
          // já estava favoritado no servidor: só sincroniza o estado visual
          this.favoritado = true;
          this.favoritoAlterado.emit(true);
        } else if (erro.status === 404 && estavaFavoritado) {
          // já não estava favoritado no servidor: só sincroniza o estado visual
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
