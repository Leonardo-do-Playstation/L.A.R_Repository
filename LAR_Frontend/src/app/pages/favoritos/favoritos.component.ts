import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AnimalCatalogo } from '../../services/catalogo-animais.service';
import { FavoritoService } from '../../services/favorito.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [AnimalCardComponent, RouterLink, BotaoVoltarComponent, MensagemEstadoComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css',
})
export class FavoritosComponent implements OnInit {
  private readonly favoritoService = inject(FavoritoService);

  animais: AnimalCatalogo[] = [];

  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregarFavoritos();
  }

  carregarFavoritos(): void {
    this.carregando = true;
    this.erro = '';

    this.favoritoService.listar().subscribe({
      next: (favoritos) => {
        this.animais = favoritos.map((favorito) => favorito.animal);
        this.carregando = false;
      },

      error: () => {
        this.carregando = false;
        this.erro = 'Não foi possível carregar seus favoritos.';
      },
    });
  }

  aoAlterarFavorito(animalId: number, favoritado: boolean): void {
    if (!favoritado) {
      this.animais = this.animais.filter((animal) => animal.id !== animalId);
    }
  }
}
