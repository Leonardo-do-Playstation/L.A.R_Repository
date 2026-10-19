import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { OngPublica, OngService } from '../../services/ong.service';
import {
  AnimalCatalogo,
  CatalogoAnimaisService,
} from '../../services/catalogo-animais.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

@Component({
  selector: 'app-detalhe-ong',
  standalone: true,
  imports: [BotaoVoltarComponent, MensagemEstadoComponent, AnimalCardComponent],
  templateUrl: './detalhe-ong.component.html',
  styleUrl: './detalhe-ong.component.css',
})
export class DetalheOngComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ongService = inject(OngService);
  private readonly catalogoAnimaisService = inject(CatalogoAnimaisService);
  private readonly favoritoService = inject(FavoritoService);
  private readonly authService = inject(AuthService);

  ong: OngPublica | null = null;

  animais: AnimalCatalogo[] = [];
  favoritosIds = new Set<number>();

  carregandoAnimais = false;
  erroAnimais = '';
  erroFavorito = '';

  private requisicaoOng = 0;
  private requisicaoAnimais = 0;

  carregando = true;
  naoEncontrado = false;
  erro = '';

  ngOnInit(): void {
    this.carregarFavoritos();

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.carregarOng(id);
    });
  }

  carregarOng(id: number): void {
    this.carregando = true;
    this.naoEncontrado = false;
    this.erro = '';
    this.animais = [];
    this.erroAnimais = '';
    this.erroFavorito = '';
    this.carregandoAnimais = false;
    this.requisicaoAnimais++;

    const requisicao = ++this.requisicaoOng;

    this.ongService.buscarPorId(id).subscribe({
      next: (ong) => {
        if (requisicao !== this.requisicaoOng) {
          return;
        }

        this.ong = ong;
        this.carregando = false;
        this.carregarAnimais(ong.id);
      },

      error: (erro: HttpErrorResponse) => {
        if (requisicao !== this.requisicaoOng) {
          return;
        }

        this.carregando = false;

        if (erro.status === 404) {
          this.naoEncontrado = true;
        } else if (erro.status === 409) {
          this.erro =
            erro.error?.mensagem ??
            'Esta ONG ainda não está disponível publicamente.';
        } else {
          this.erro = 'Não foi possível carregar os dados desta ONG.';
        }
      },
    });
  }

  carregarAnimais(idOng: number): void {
    const requisicao = ++this.requisicaoAnimais;

    this.carregandoAnimais = true;
    this.erroAnimais = '';
    this.animais = [];

    this.catalogoAnimaisService.listar({ idOng }).subscribe({
      next: (animais) => {
        if (requisicao !== this.requisicaoAnimais) {
          return;
        }

        this.animais = animais;
        this.carregandoAnimais = false;
      },

      error: () => {
        if (requisicao !== this.requisicaoAnimais) {
          return;
        }

        this.carregandoAnimais = false;
        this.erroAnimais = 'Não foi possível carregar os animais desta ONG.';
      },
    });
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
    this.erroFavorito = '';

    if (favoritado) {
      this.favoritosIds.add(animalId);
    } else {
      this.favoritosIds.delete(animalId);
    }
  }

  get semInformacoes(): boolean {
    return (
      !!this.ong &&
      !this.ong.cnpj &&
      !this.ong.endereco &&
      !this.ong.telefone &&
      !this.ong.observacoes
    );
  }

  inicial(nome: string): string {
    return nome.trim().charAt(0).toUpperCase();
  }
}
