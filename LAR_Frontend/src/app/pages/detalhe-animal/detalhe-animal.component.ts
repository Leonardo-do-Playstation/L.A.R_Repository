import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  CatalogoAnimaisService,
  AnimalCatalogo,
} from '../../services/catalogo-animais.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';
import { BotaoContatoComponent } from '../../components/botao-contato/botao-contato.component';
import { linkMaps, linkWhatsapp } from '../../services/contato-ong.service';
@Component({
  selector: 'app-detalhe-animal',
  standalone: true,
  imports: [RouterLink, BotaoVoltarComponent, BotaoContatoComponent, MensagemEstadoComponent],
  templateUrl: './detalhe-animal.component.html',
  styleUrl: './detalhe-animal.component.css',
})
export class DetalheAnimalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogoAnimaisService = inject(CatalogoAnimaisService);
  private readonly favoritoService = inject(FavoritoService);
  private readonly authService = inject(AuthService);

  animal: AnimalCatalogo | null = null;

  carregando = true;
  naoEncontrado = false;
  erro = '';

  favoritado = false;
  processandoFavorito = false;
  erroFavorito = '';

  get usuarioLogado(): boolean {
    return this.authService.estaAutenticado();
  }

  get urlWhatsapp(): string | null {
    if (!this.animal) {
      return null;
    }

    return linkWhatsapp(
      this.animal.ong.telefone,
      `Olá! Vi ${this.animal.nome} no L.A.R. e tenho interesse em adotar.`,
    );
  }

  get urlMaps(): string | null {
    return linkMaps(this.animal?.ong.endereco);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.carregarAnimal(id);
    });
  }

  carregarAnimal(id: number): void {
    this.carregando = true;
    this.naoEncontrado = false;
    this.erro = '';

    this.catalogoAnimaisService.buscarPorId(id).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.carregando = false;
        this.carregarEstadoFavorito(animal.id);
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        if (erro.status === 404) {
          this.naoEncontrado = true;
        } else {
          this.erro = 'Não foi possível carregar os dados deste animal.';
        }
      },
    });
  }

  carregarEstadoFavorito(animalId: number): void {
    this.favoritado = false;

    const perfil = this.authService.obterPerfil();

    if (!this.authService.estaAutenticado() || perfil?.tipo !== 'ADOTANTE') {
      return;
    }

    this.favoritoService.listarIds().subscribe({
      next: (ids) => {
        this.favoritado = ids.has(animalId);
      },

      error: () => {},
    });
  }

  alternarFavorito(): void {
    if (!this.animal || this.processandoFavorito) {
      return;
    }

    this.processandoFavorito = true;
    this.erroFavorito = '';
    const estavaAutenticado = this.authService.estaAutenticado();

    const acao = this.favoritado
      ? this.favoritoService.desfavoritar(this.animal.id)
      : this.favoritoService.favoritar(this.animal.id);

    acao.subscribe({
      next: () => {
        this.favoritado = !this.favoritado;
        this.processandoFavorito = false;
      },

      error: (erro: HttpErrorResponse) => {
        this.processandoFavorito = false;

        if (erro.status === 401 && estavaAutenticado) {
          return;
        }

        if (erro.status === 401 || erro.status === 403) {
          this.erroFavorito =
            'Você precisa estar logado como Adotante para favoritar.';
        } else if (erro.status === 409 && !this.favoritado) {
          this.favoritado = true;
        } else if (erro.status === 404 && this.favoritado) {
          this.favoritado = false;
        } else {
          this.erroFavorito = 'Não foi possível favoritar este animal.';
        }
      },
    });
  }

  imagemAnimal(): string {
    return this.animal?.foto || '/assets/camera.svg';
  }

  erroImagem(event: Event): void {
    const imagem = event.target as HTMLImageElement;
    imagem.src = '/assets/camera.svg';
  }

  classeStatus(): string {
    switch (this.animal?.status) {
      case 'DISPONIVEL':
        return 'detalhe-animal__status-dot--disponivel';

      case 'ADOTADO':
        return 'detalhe-animal__status-dot--adotado';

      case 'EM_TRATAMENTO':
        return 'detalhe-animal__status-dot--tratamento';

      default:
        return 'detalhe-animal__status-dot--indefinido';
    }
  }

  nomeStatus(): string {
    switch (this.animal?.status) {
      case 'DISPONIVEL':
        return 'Disponível';

      case 'ADOTADO':
        return 'Adotado';

      case 'EM_TRATAMENTO':
        return 'Em tratamento';

      default:
        return this.animal?.status ?? '';
    }
  }
}
